export default {
  // 1. HTTP HANDLER: For Subscribing via Website
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    if (request.method === "POST") {
      try {
        const url = new URL(request.url);
        
        // Handle /subscribe route
        if (url.pathname === "/subscribe") {
          const { email } = await request.json();

          if (!email || !email.includes("@")) {
            return new Response(JSON.stringify({ error: "Invalid email address." }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          }

          // Insert into D1 Database
          if (env.DB) {
            await env.DB.prepare("INSERT OR IGNORE INTO subscribers (email) VALUES (?)")
              .bind(email)
              .run();
            
            return new Response(JSON.stringify({ success: "You are now tuned to the cosmic frequencies." }), {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          } else {
            throw new Error("D1 Database not connected.");
          }
        }
        
        return new Response(JSON.stringify({ error: "Not found." }), { status: 404, headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Astro Insight Newsletter API", { status: 200 });
  },

  // 2. CRON HANDLER: For Sending Weekly Newsletter
  async scheduled(event, env, ctx) {
    // We pass the promise to ctx.waitUntil to ensure the worker doesn't shut down before emails are sent
    ctx.waitUntil(this.generateAndSendNewsletter(env));
  },

  async generateAndSendNewsletter(env) {
    console.log("Waking up to send the Weekly Cosmic Report...");

    // 1. Get all active subscribers from D1
    if (!env.DB) throw new Error("D1 Database not bound.");
    const { results } = await env.DB.prepare("SELECT email FROM subscribers WHERE status = 'active'").all();
    
    if (!results || results.length === 0) {
      console.log("No active subscribers found. Going back to sleep.");
      return;
    }

    // 2. Generate the Astrology Report using the AI Cascade
    const systemPrompt = `You are the master astrologer for Astro Insight. 
    Write a captivating, deep, and slightly mysterious weekly astrology report. 
    Format it in beautiful HTML (use <h2>, <p>, <strong>, <em>, <br>). Do not use Markdown.
    Start with an atmospheric greeting. 
    Highlight the major planetary shifts for the upcoming week and how they will affect collective energy.
    Keep it between 250 - 400 words.`;
    
    const userPrompt = "Write this week's Cosmic Report.";
    let reportHtml = "";

    try {
      reportHtml = await callGroqKaszkad(userPrompt, systemPrompt, env.GROQ_API_KEY);
    } catch (e1) {
      console.warn("Groq failed for newsletter. Switching to Gemini...", e1.message);
      try {
        reportHtml = await callGeminiKaszkad(userPrompt, systemPrompt, env.GEMINI_API_KEY);
      } catch (e2) {
        console.warn("Gemini failed. Switching to CF AI...", e2.message);
        reportHtml = await callCloudflareAIKaszkad(userPrompt, systemPrompt, env.AI);
      }
    }

    if (!reportHtml) throw new Error("AI failed to generate report.");

    // Format the final email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #fff; background-color: #111; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="color: #c9a0ff; text-align: center; border-bottom: 1px solid #333; padding-bottom: 10px;">Astro Insight: Weekly Cosmic Report</h1>
        <div style="font-size: 16px; line-height: 1.6; padding: 15px 0;">
          ${reportHtml}
        </div>
        <p style="text-align: center; font-size: 12px; color: #666; border-top: 1px solid #333; padding-top: 20px; margin-top: 30px;">
          You are receiving this because you subscribed to Astro Insight. <br>
          Look to the stars.
        </p>
      </div>
    `;

    // 3. Send Emails via Resend API
    if (!env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY. Cannot send emails.");
      return;
    }

    // Prepare batch sending. Resend allows batch sending to avoid rate limits on their end.
    // For large lists, you would chunk this into arrays of 100.
    const emailsToSend = results.map(row => ({
      from: 'Astro Insight <newsletter@astroinsight.space>', // User needs to configure their domain in Resend
      to: [row.email],
      subject: 'Your Weekly Cosmic Report has arrived ✨',
      html: emailHtml
    }));

    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailsToSend)
    });

    if (res.ok) {
      console.log(`Successfully sent ${results.length} emails!`);
    } else {
      const errorText = await res.text();
      console.error("Failed to send emails via Resend:", errorText);
    }
  }
};

// --- 1. GROQ CASCADE ---
async function callGroqKaszkad(question, systemInstruction, apiKey) {
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "qwen/qwen3.8-27b",
      messages: [{ role: "system", content: systemInstruction }, { role: "user", content: question }],
      max_tokens: 800, temperature: 0.85
    })
  });
  if (res.ok) {
    const data = await res.json();
    return data.choices[0].message.content;
  }
  throw new Error("Groq failed.");
}

// --- 2. GEMINI CASCADE ---
async function callGeminiKaszkad(question, systemInstruction, apiKey) {
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
  throw new Error("Gemini failed.");
}

// --- 3. CLOUDFLARE AI CASCADE ---
async function callCloudflareAIKaszkad(question, systemInstruction, aiBinding) {
  if (!aiBinding) throw new Error("Missing AI Binding");
  const response = await aiBinding.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: question }
    ],
    max_tokens: 800, temperature: 0.85
  });
  if (response && response.response) return response.response;
  throw new Error("Cloudflare AI failed.");
}
