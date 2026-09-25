// ==========================================
// CLOUDFLARE WORKER: THE SEER'S SPHERE (GEMINI -> GROQ -> CF AI)
// ==========================================

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // Allow only POST requests
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), { 
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
      });
    }

    try {
      const text = await request.text();
      let userQuestion = "";

      if (text) {
        const json = JSON.parse(text);
        userQuestion = (json.message || json.prompt || json.text || json.question || json.msg || "").trim();
      }

      if (!userQuestion) {
        return new Response(JSON.stringify({ response: "The sphere remains dark. Please whisper a question..." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
        });
      }

      // 1. RATE LIMITING: Check IP Address against KV Store
      const clientIP = request.headers.get("CF-Connecting-IP") || "unknown-ip";
      const rateLimitKey = `oracle_usage_${clientIP}`;
      
      if (env.SEER_SPHERE_KV) {
          let usage = await env.SEER_SPHERE_KV.get(rateLimitKey);
          let count = usage ? parseInt(usage, 10) : 0;
          
          if (count >= 3) {
              return new Response(JSON.stringify({ 
                  response: "The sphere needs rest. Only 3 questions per day are permitted. Please return tomorrow." 
              }), { 
                  status: 429,
                  headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
              });
          }
      }

      // --- TÉMÁK ÉS METAFORÁK (A gömb egyedi hangulatához) ---
      const secretThemes = ["career strategy", "romantic communication", "financial budgeting", "mental resilience"];
      const metaphorDomains = ["Architecture and blueprints", "Gardening and roots", "Mountain climbing", "Blacksmithing and forging"];
      const randomTheme = secretThemes[Math.floor(Math.random() * secretThemes.length)];
      const randomMetaphor = metaphorDomains[Math.floor(Math.random() * metaphorDomains.length)];

      const systemPrompt = `You are the mystical Seer's Sphere for Astro Insight, delivering profound, metaphorical reflections.
RULES:
1. LENGTH: Write EXACTLY 3 to 4 sentences. Stop immediately after the 4th sentence.
2. LANGUAGE: Respond in the exact same language as the user's question.
3. THEME & METAPHOR: Base your insight on ${randomTheme}. Describe the situation using metaphors of ${randomMetaphor}.
4. TONE: Mysterious, truthful, analytical, and grounding.

BLACKLIST: Do NOT use the words tide, tides, ocean, cosmic, align, stars, universe, celestial.`;

      let oracleResponse = "";

      // --- KASZKÁD LOGIKA (Gemini -> Groq -> Cloudflare Native AI) ---
      try {
        oracleResponse = await callGeminiKaszkad(userQuestion, systemPrompt, env.GEMINI_API_KEY);
      } catch (geminiError) {
        console.warn("Gemini kimerült a Gömbben, váltás Groq Kaszkádra...", geminiError.message);
        
        try {
          oracleResponse = await callGroqKaszkad(userQuestion, systemPrompt, env.GROQ_API_KEY);
        } catch (groqError) {
          console.warn("Groq is kimerült, váltás a végső Cloudflare AI-ra...", groqError.message);
          
          try {
            oracleResponse = await callCloudflareAIKaszkad(userQuestion, systemPrompt, env.AI);
          } catch (cfError) {
            console.error("Minden AI szolgáltatás kimerült a Gömbben!", cfError.message);
            oracleResponse = "The sphere is clouded at this moment. Please whisper your question again shortly.";
          }
        }
      }

      // --- REGEX PAJZS (Klisék szűrése) ---
      if (oracleResponse && !oracleResponse.includes("clouded at this moment")) {
        oracleResponse = oracleResponse
          .replace(/\b(The\s+)?tides?\s+of\s+(the\s+)?(universe|moon|cosmos)\b/gi, "The momentum of life")
          .replace(/\btides?\b/gi, "momentum")
          .replace(/\b(The\s+)?stars\s+align\b/gi, "Conditions are perfect")
          .replace(/\bcosmic\b/gi, "natural")
          .replace(/\bcelestial\b/gi, "internal");
          
        oracleResponse = oracleResponse.charAt(0).toUpperCase() + oracleResponse.slice(1);
      }

      // SUCCESS: Save usage in KV Store
      if (env.SEER_SPHERE_KV) {
          let usage = await env.SEER_SPHERE_KV.get(rateLimitKey);
          let count = usage ? parseInt(usage, 10) : 0;
          const now = new Date();
          const nyTimeStr = now.toLocaleString("en-US", { timeZone: "America/New_York" });
          const nyNow = new Date(nyTimeStr);
          const nyMidnight = new Date(nyNow);
          nyMidnight.setDate(nyMidnight.getDate() + 1);
          nyMidnight.setHours(0, 0, 0, 0);
          const secondsUntilMidnight = Math.max(60, Math.floor((nyMidnight.getTime() - nyNow.getTime()) / 1000));
          await env.SEER_SPHERE_KV.put(rateLimitKey, (count + 1).toString(), { expirationTtl: secondsUntilMidnight });
      }

      return new Response(JSON.stringify({ response: oracleResponse.trim() }), {
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
      });

    } catch (error) {
      return new Response(JSON.stringify({ response: "The sphere's vision is blurred. Try again later." }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } 
      });
    }
  }
};

// --- 1. GEMINI KASZKÁD ---
async function callGeminiKaszkad(question, systemInstruction, apiKey) {
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const models = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash-lite"];
  
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: question }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.85 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) {}
  }
  throw new Error("Gemini models failed.");
}

// --- 2. GROQ KASZKÁD ---
async function callGroqKaszkad(question, systemInstruction, apiKey) {
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
            { role: "user", content: question }
          ],
          max_tokens: 800, 
          temperature: 0.85
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

// --- 3. CLOUDFLARE NATIVE AI KASZKÁD ---
async function callCloudflareAIKaszkad(question, systemInstruction, aiBinding) {
  if (!aiBinding) throw new Error("Missing Cloudflare AI binding (env.AI)");
  const models = ["@cf/mistral/mistral-7b-instruct-v0.1", "@cf/meta/llama-3.1-8b-instruct"];
  
  for (const model of models) {
    try {
      const response = await aiBinding.run(model, {
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: question }
        ],
        max_tokens: 800,
        temperature: 0.85
      });
      if (response && response.response) {
        return response.response;
      }
    } catch (e) {}
  }
  throw new Error("Cloudflare AI models failed.");
}