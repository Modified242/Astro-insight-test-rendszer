// ==========================================
// CLOUDFLARE WORKER: NUMEROLOGY BOT (GROQ -> GEMINI -> CF AI CASCADE)
// ==========================================

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (request.method !== "POST") return new Response("Use POST for chat.", { status: 405, headers: corsHeaders });

    try {
      const json = await request.json();
      const userName = (json.message || json.prompt || json.text || json.name || "").trim();

      if (!userName) {
        return new Response(JSON.stringify({ response: "Your Hidden Arcana: Silent Soul\n\nThe cosmic grid requires a name to calculate its vibration." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
        });
      }

      const systemPrompt = `You are a mystical Numerologist. 
Strict Rules:
1. START EXACTLY with: "Your Hidden Arcana: [Mystical Title]".
2. NO MATH: Never show the mathematical breakdown. Reveal only the mystical interpretation.
3. MAX LENGTH: 3 to 4 sentences.
4. TONE: Mystical, wise, cosmic.
5. LANGUAGE: English only.`;

      let oracleResponse = "";

      // 1. RATE LIMITING: Check IP Address against KV Store
      const clientIP = request.headers.get("CF-Connecting-IP") || "unknown-ip";
      const rateLimitKey = `num_usage_${clientIP}`;
      
      if (env.NUMEROLOGY_KV) {
          let usage = await env.NUMEROLOGY_KV.get(rateLimitKey);
          let count = usage ? parseInt(usage, 10) : 0;
          
          if (count >= 3) {
              return new Response(JSON.stringify({ 
                  response: "The Oracle needs rest. Only 3 readings per day are permitted. Please return tomorrow." 
              }), { 
                  status: 429,
                  headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
              });
          }
      }

      // --- KASZKÁD LOGIKA: 1. GROQ -> 2. GEMINI -> 3. CLOUDFLARE AI ---
      try {
        oracleResponse = await callGroqKaszkad(userName, systemPrompt, env.GROQ_API_KEY);
      } catch (groqError) {
        console.warn("Groq Numerology kimerült, váltás Gemini Kaszkádra...", groqError.message);
        
        try {
          oracleResponse = await callGeminiKaszkad(userName, systemPrompt, env.GEMINI_API_KEY);
        } catch (geminiError) {
          console.warn("Gemini is kimerült, váltás a végső Cloudflare AI-ra...", geminiError.message);
          
          try {
            oracleResponse = await callCloudflareAIKaszkad(userName, systemPrompt, env.AI);
          } catch (cfError) {
            console.error("Minden Numerológiai AI kimerült!", cfError.message);
            oracleResponse = "Your Hidden Arcana: Shrouded Numbers\n\nThe mathematical grid is currently updating its cosmic nodes. Please realign with us in a few moments.";
          }
        }
      }

      // SUCCESS: Save usage in KV Store
      if (env.NUMEROLOGY_KV) {
          let usage = await env.NUMEROLOGY_KV.get(rateLimitKey);
          let count = usage ? parseInt(usage, 10) : 0;
          const now = new Date();
          const nyTimeStr = now.toLocaleString("en-US", { timeZone: "America/New_York" });
          const nyNow = new Date(nyTimeStr);
          const nyMidnight = new Date(nyNow);
          nyMidnight.setDate(nyMidnight.getDate() + 1);
          nyMidnight.setHours(0, 0, 0, 0);
          const secondsUntilMidnight = Math.max(60, Math.floor((nyMidnight.getTime() - nyNow.getTime()) / 1000));
          await env.NUMEROLOGY_KV.put(rateLimitKey, (count + 1).toString(), { expirationTtl: secondsUntilMidnight });
      }

      return new Response(JSON.stringify({ response: oracleResponse.trim() }), {
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
      });

    } catch (error) {
      return new Response(JSON.stringify({ response: "Mathematical disruption." }), { status: 500, headers: corsHeaders });
    }
  }
};

// --- 1. GROQ KASZKÁD (ELSŐDLEGES) ---
async function callGroqKaszkad(name, systemInstruction, apiKey) {
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");
  const models = [
    "qwen/qwen3.8-27b",
    "qwen/qwen3.6-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "allam-2-7b"
  ];
  
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
            { role: "user", content: `Analyze the name: "${name}"` }
          ],
          max_tokens: 300, 
          temperature: 0.8
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices[0].message.content;
      }
    } catch (e) {}
  }
  throw new Error("Groq models failed.");
}

// --- 2. GEMINI KASZKÁD (MÁSODLAGOS) ---
async function callGeminiKaszkad(name, systemInstruction, apiKey) {
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const models = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash-lite"];
  
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: `${systemInstruction} Analyze the name: "${name}"` }] }] })
      });
      if (res.ok) {
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) {}
  }
  throw new Error("Gemini models failed.");
}

// --- 3. CLOUDFLARE NATIVE AI KASZKÁD (VÉGSŐ VÉDŐHÁLÓ) ---
async function callCloudflareAIKaszkad(name, systemInstruction, aiBinding) {
  if (!aiBinding) throw new Error("Missing Cloudflare AI binding (env.AI)");
  const models = ["@cf/mistral/mistral-7b-instruct-v0.1", "@cf/meta/llama-3.1-8b-instruct"];
  
  for (const model of models) {
    try {
      const response = await aiBinding.run(model, {
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Analyze the name: "${name}"` }
        ],
        max_tokens: 300,
        temperature: 0.8
      });
      if (response && response.response) {
        return response.response;
      }
    } catch (e) {}
  }
  throw new Error("Cloudflare AI models failed.");
}