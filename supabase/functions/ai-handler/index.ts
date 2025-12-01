import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AIRequest {
  mode: "matchSitters" | "dailyReport" | "profileSummary" | "chatModeration" | "siteAssistant";
  userRole: "owner" | "sitter" | "guest";
  payload: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { mode, userRole, payload }: AIRequest = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    switch (mode) {
      case "matchSitters":
        systemPrompt = "You are an AI assistant for Cozy Pets by Alice, a pet-sitting platform. Your role is to match pet owners with the best sitters based on their pet's needs, service requirements, and location.";
        userPrompt = `Find the best sitters for:\n- Service: ${payload.serviceType}\n- Pet Type: ${payload.petType}\n- Location: ${payload.location}\n- Special needs: ${payload.specialNeeds || 'None'}\n\nProvide a brief analysis in Bulgarian.`;
        break;

      case "dailyReport":
        systemPrompt = "You are an AI assistant for Cozy Pets by Alice. Generate daily pet care reports in Bulgarian based on sitter notes and activities.";
        userPrompt = `Generate a daily report for:\n- Pet: ${payload.petName}\n- Activities: ${payload.activities.join(', ')}\n- Sitter notes: ${payload.notes || 'No additional notes'}\n\nCreate a warm, informative report in Bulgarian for the pet owner.`;
        break;

      case "profileSummary":
        systemPrompt = "You are an AI assistant for Cozy Pets by Alice. Summarize sitter profiles highlighting key strengths and qualifications in Bulgarian.";
        userPrompt = `Summarize this sitter profile:\n- Name: ${payload.name}\n- Experience: ${payload.experienceYears} years\n- Rating: ${payload.rating}/5\n- Services: ${payload.services.join(', ')}\n- Bio: ${payload.bio || 'No bio'}\n\nProvide a concise, appealing summary in Bulgarian.`;
        break;

      case "chatModeration":
        systemPrompt = "You are a content moderation AI for Cozy Pets by Alice. Detect if messages contain contact information, inappropriate content, or attempts to bypass the platform.";
        userPrompt = `Analyze this message for safety:\n"${payload.message}"\n\nRespond with 'SAFE' or 'UNSAFE' and a brief reason in Bulgarian.`;
        break;

      case "siteAssistant":
        systemPrompt = `You are the official AI assistant for "Cozy Pets by Alice", a premium pet-sitting platform in Bulgaria. You help users (pet owners, sitters, and guests) understand how the platform works. Always answer in Bulgarian. Be friendly, helpful, and accurate. Never invent external policies or information not related to Cozy Pets.

Key platform features:
- Services: dog walking, pet sitting, cat care, grooming, training, vet transport
- Payment: 20% platform fee, 80% goes to sitter, held in escrow until job completion
- Chat: Available only after payment confirmation
- Veterinary consultation: Available only for emergencies
- Booking process: Search sitters → Book → Pay → Chat activated → Service completed → Review`;
        userPrompt = `User role: ${userRole}\nQuestion: ${payload.question}`;
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, error: "Invalid mode" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ success: false, error: `OpenAI API error: ${error}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ success: true, content }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});