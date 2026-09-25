export default {
    async fetch(request, env) {
        const corsHeaders = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
        };
        
        if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
        
        // Allow only POST requests for Tarot readings
        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), { 
                status: 405,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }
        
        try {
            // 1. RATE LIMITING: Check IP Address against KV Store
            const clientIP = request.headers.get("CF-Connecting-IP") || "unknown-ip";
            const rateLimitKey = `tarot_usage_${clientIP}`;
            
            // Check if they already pulled a reading today
            if (env.TAROT_KV) {
                let usage = await env.TAROT_KV.get(rateLimitKey);
                let count = usage ? parseInt(usage, 10) : 0;
                
                if (count >= 1) {
                    return new Response(JSON.stringify({ 
                        error: "The Oracle needs rest. Only 1 reading per day is permitted. Please return tomorrow." 
                    }), { 
                        status: 429, // 429 Too Many Requests
                        headers: { ...corsHeaders, "Content-Type": "application/json" }
                    });
                }
            } else {
                console.warn("TAROT_KV binding not found. Skipping rate limit check.");
            }

            
            // 2. Parse the incoming Tarot spread from the client
            const body = await request.json();
            const { past, present, future } = body;
            
            if (!past || !present || !future) {
                return new Response(JSON.stringify({ error: "Invalid spread data provided." }), { 
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
            
            // 3. Define the High-Tech Esoteric System Prompt
            const systemPrompt = `You are the AI Tarot Oracle for Astro Insight. Provide a cinematic, deep, and mystical interpretation of the user's 3-card spread (Past, Present, Future). Use elegant, profound American English. Do not be overly positive; be truthful, analytical, and slightly mysterious. Format your response cleanly using only standard HTML tags (e.g., <h3>, <p>, <strong>) so it can be injected directly into a dark-themed webpage. Do NOT use Markdown (no asterisks or hash symbols). Keep the total reading under 300 words.`;
            const userPrompt = `Read the following 3-card Arcana Spread:
            - Past: ${past.name} (${past.type})
            - Present: ${present.name} (${present.type})
            - Future: ${future.name} (${future.type})
            
            Reveal the path.`;
            
            let interpretation = "";
            
            // --- 4. CASCADE AI SYSTEM (Groq -> Cloudflare Native AI) ---
            try {
                interpretation = await callGroqKaszkad(userPrompt, systemPrompt, env.GROQ_API_KEY);
            } catch (groqError) {
                console.warn("Groq Oracle kimerült, váltás Cloudflare AI-ra...", groqError.message);
                
                try {
                    interpretation = await callCloudflareAIKaszkad(userPrompt, systemPrompt, env.AI);
                } catch (cfError) {
                    console.error("Minden Tarot AI kimerült!", cfError.message);
                    throw new Error("The Oracle's connection to the ether was disrupted.");
                }
            }
            
            // 5. SUCCESS: Save usage in KV Store so they can't do it again until Midnight US Eastern Time
            if (env.TAROT_KV) {
                let usage = await env.TAROT_KV.get(rateLimitKey);
                let count = usage ? parseInt(usage, 10) : 0;
                
                const now = new Date();
                
                // Find what time it currently is in New York
                const nyTimeStr = now.toLocaleString("en-US", { timeZone: "America/New_York" });
                const nyNow = new Date(nyTimeStr);
                
                // Calculate exactly when the NEXT midnight happens in New York
                const nyMidnight = new Date(nyNow);
                nyMidnight.setDate(nyMidnight.getDate() + 1);
                nyMidnight.setHours(0, 0, 0, 0);
                
                // Calculate seconds left until New York midnight
                const secondsUntilMidnight = Math.max(60, Math.floor((nyMidnight.getTime() - nyNow.getTime()) / 1000));
                
                // Store the IP in KV. It will automatically delete itself exactly at Midnight NY time!
                await env.TAROT_KV.put(rateLimitKey, (count + 1).toString(), { expirationTtl: secondsUntilMidnight });
            }

            
            // 6. Send the mystical insight back to Astro Insight
            return new Response(JSON.stringify({ reading: interpretation }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
            
        } catch (error) {
            console.error("Oracle AI Error:", error.message);
            return new Response(JSON.stringify({ error: "The Oracle's connection to the ether was disrupted. Please try again." }), { 
                status: 500,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }
    }
};

// --- 1. GROQ KASZKÁD ---
async function callGroqKaszkad(question, systemInstruction, apiKey) {
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");
  
  const models = [
    "qwen/qwen3.8-27b",
    "qwen/qwen3.6-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "allam-2-7b"
  ];
  
  let lastError;
  for (const model of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${apiKey}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemInstruction }, 
            { role: "user", content: question }
          ],
          max_tokens: 600, 
          temperature: 0.85
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices[0].message.content;
      }
      lastError = await res.text();
    } catch (e) { lastError = e.message; }
  }
  throw new Error(lastError);
}

// --- 2. CLOUDFLARE NATIVE AI KASZKÁD ---
async function callCloudflareAIKaszkad(question, systemInstruction, aiBinding) {
  if (!aiBinding) throw new Error("Missing Cloudflare AI binding (env.AI)");
  
  const models = [
    "@cf/mistral/mistral-7b-instruct-v0.1",
    "@cf/meta/llama-3.1-8b-instruct"
  ];
  
  let lastError;
  for (const model of models) {
    try {
      const response = await aiBinding.run(model, {
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: question }
        ],
        max_tokens: 600,
        temperature: 0.85
      });
      
      if (response && response.response) {
        return response.response;
      }
      lastError = "Empty response from Cloudflare AI";
    } catch (e) { 
      lastError = e.message; 
    }
  }
  throw new Error(lastError);
}
