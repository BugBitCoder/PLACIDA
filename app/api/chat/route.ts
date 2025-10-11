// // import { type NextRequest, NextResponse } from "next/server"
// // import { generateText } from "ai"

// // // Server-side model selection only. The AI Gateway handles provider routing/keys.
// // const GROK_MODEL = process.env.GROK_MODEL || "xai/grok-4"

// // export async function POST(req: NextRequest) {
// //   try {
// //     const body = await req.json().catch(() => ({}))
// //     const { message, messages } = body as {
// //       message?: string
// //       messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>
// //     }

// //     if ((!message || message.length === 0) && (!messages || messages.length === 0)) {
// //       return NextResponse.json({ error: "Message required" }, { status: 400 })
// //     }

// //     const systemPrompt =
// //       "You are Placida, a warm, compassionate mental well-being companion. " +
// //       "Offer brief, empathetic reflections and gentle, practical suggestions. " +
// //       "Avoid medical diagnoses. Encourage seeking professional help if needed."

// //     // Build chat history with system prompt
// //     const history: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
// //       { role: "system", content: systemPrompt },
// //     ]

// //     if (Array.isArray(messages) && messages.length > 0) {
// //       for (const m of messages) {
// //         if (!m?.content || typeof m.content !== "string") continue
// //         const role = m.role === "assistant" || m.role === "system" ? m.role : "user"
// //         history.push({ role, content: m.content })
// //       }
// //     } else if (typeof message === "string" && message.length > 0) {
// //       history.push({ role: "user", content: message })
// //     }

// //     // Convert history into a single prompt for generateText
// //     const prompt = history
// //       .map((m) => {
// //         const role = m.role === "system" ? "System" : m.role === "assistant" ? "Assistant" : "User"
// //         return `${role}: ${m.content}`
// //       })
// //       .concat("Assistant:")
// //       .join("\n")

// //     // Use AI SDK with sane defaults via AI Gateway; no direct key/URL usage
// //     const { text } = await generateText({
// //       model: GROK_MODEL,
// //       prompt,
// //       maxOutputTokens: 800,
// //       temperature: 0.7,
// //     })

// //     return NextResponse.json({ reply: text })
// //   } catch (err) {
// //     return NextResponse.json({ reply: "", error: "Unexpected server error contacting model." }, { status: 500 })
// //   }
// // }



// // import { type NextRequest, NextResponse } from "next/server";

// // export async function POST(req: NextRequest) {
// //   try {
// //     // Parse the request body
// //     const body = await req.json().catch(() => ({}));
// //     const { message, messages } = body as {
// //       message?: string;
// //       messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
// //     };

// //     // Validate input
// //     if ((!message || message.length === 0) && (!messages || messages.length === 0)) {
// //       return NextResponse.json({ error: "Message required" }, { status: 400 });
// //     }

// //     // Get the Grok API key from environment variables
// //     const apiKey = process.env.GROK_API_KEY;
// //     if (!apiKey) {
// //       return NextResponse.json(
// //         { error: "Server configuration error: Missing GROK_API_KEY" },
// //         { status: 500 }
// //       );
// //     }

// //     // Define the system prompt
// //     const systemPrompt =
// //       "You are Placida, a warm, compassionate mental well-being companion. " +
// //       "Offer brief, empathetic reflections and gentle, practical suggestions. " +
// //       "Avoid medical diagnoses. Encourage seeking professional help if needed.";

// //     // Build chat history with system prompt
// //     const history: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
// //       { role: "system", content: systemPrompt },
// //     ];

// //     if (Array.isArray(messages) && messages.length > 0) {
// //       for (const m of messages) {
// //         if (!m?.content || typeof m.content !== "string") continue;
// //         const role = m.role === "assistant" || m.role === "system" ? m.role : "user";
// //         history.push({ role, content: m.content });
// //       }
// //     } else if (typeof message === "string" && message.length > 0) {
// //       history.push({ role: "user", content: message });
// //     }

// //     // Make a request to the xAI Grok API
// //     const response = await fetch("https://api.x.ai/v1/chat/completions", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${apiKey}`,
// //       },
// //       body: JSON.stringify({
// //         model: "grok-3", // Adjust model as needed (e.g., grok-4 if available)
// //         messages: history,
// //         max_tokens: 800,
// //         temperature: 0.7,
// //         stream: false,
// //       }),
// //     });

// //     // Handle API response
// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       return NextResponse.json(
// //         { error: `Grok API error: ${errorData.message || response.statusText}` },
// //         { status: response.status }
// //       );
// //     }

// //     // Parse the response and extract the reply
// //     const data = await response.json();
// //     const reply = data.choices?.[0]?.message?.content;

// //     if (!reply) {
// //       return NextResponse.json(
// //         { error: "No response content from Grok API" },
// //         { status: 500 }
// //       );
// //     }

// //     // Return the reply in the format expected by the frontend
// //     return NextResponse.json({ reply });
// //   } catch (err) {
// //     console.error("Error in /api/chat:", err);
// //     return NextResponse.json(
// //       { reply: "", error: "Unexpected server error contacting model." },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { type NextRequest, NextResponse } from "next/server";

// export const runtime = "edge"; // optional: improves speed in Vercel Edge runtime

// export async function POST(req: NextRequest) {
//   try {
//     // Parse body
//     const body = await req.json().catch(() => ({}));
//     const { message, messages } = body as {
//       message?: string;
//       messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
//     };

//     // Validate input
//     if ((!message || !message.trim()) && (!messages || messages.length === 0)) {
//       return NextResponse.json({ error: "Message required" }, { status: 400 });
//     }

//     // Get API key
//     const apiKey = process.env.GROK_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { error: "Server misconfiguration: Missing GROK_API_KEY" },
//         { status: 500 }
//       );
//     }

//     // Define system prompt
//     const systemPrompt =
//       "You are Placida, a warm, compassionate mental well-being companion. " +
//       "Offer brief, empathetic reflections and gentle, practical suggestions. " +
//       "Avoid medical diagnoses. Encourage seeking professional help if needed.";

//     // Construct chat history
//     const history: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
//       { role: "system", content: systemPrompt },
//     ];

//     if (Array.isArray(messages) && messages.length > 0) {
//       for (const m of messages) {
//         if (!m?.content || typeof m.content !== "string") continue;
//         const role =
//           m.role === "assistant" || m.role === "system" ? m.role : "user";
//         history.push({ role, content: m.content });
//       }
//     } else if (message && typeof message === "string") {
//       history.push({ role: "user", content: message });
//     }

//     // Make request to xAI Grok API with timeout
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

//     const response = await fetch("https://api.x.ai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "grok-3", // or grok-2, grok-beta depending on availability
//         messages: history,
//         max_tokens: 800,
//         temperature: 0.7,
//       }),
//       signal: controller.signal,
//     }).finally(() => clearTimeout(timeout));

//     // Handle failed responses
//     if (!response.ok) {
//       let errorText = response.statusText;
//       try {
//         const errData = await response.json();
//         errorText = errData.message || JSON.stringify(errData);
//       } catch {}
//       return NextResponse.json(
//         { error: `Grok API error: ${errorText}` },
//         { status: response.status }
//       );
//     }

//     // Parse successful response
//     const data = await response.json();
//     const reply = data?.choices?.[0]?.message?.content?.trim();

//     if (!reply) {
//       return NextResponse.json(
//         { error: "No content received from Grok API" },
//         { status: 500 }
//       );
//     }

//     // Return clean reply
//     return NextResponse.json({ reply });
//   } catch (err: any) {
//     console.error("Error in /api/chat:", err);

//     // Handle known fetch/timeout errors clearly
//     if (err.name === "AbortError") {
//       return NextResponse.json(
//         { error: "Connection to Grok API timed out (20s limit)." },
//         { status: 504 }
//       );
//     }

//     return NextResponse.json(
//       {
//         error: `Unexpected server error: ${err?.message || "Unknown error"}`,
//       },
//       { status: 500 }
//     );
//   }
// }




// import { type NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json().catch(() => ({}));
//     const { message, messages } = body as {
//       message?: string;
//       messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
//     };

//     if ((!message || !message.trim()) && (!messages || messages.length === 0)) {
//       return NextResponse.json({ error: "Message required" }, { status: 400 });
//     }

//     const apiKey = process.env.GROK_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { error: "Missing GROK_API_KEY in environment" },
//         { status: 500 }
//       );
//     }

//     const systemPrompt =
//       "You are Placida, a warm, compassionate mental well-being companion. " +
//       "Offer brief, empathetic reflections and gentle, practical suggestions. " +
//       "Avoid medical diagnoses. Encourage seeking professional help if needed.";

//     const history: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
//       { role: "system", content: systemPrompt },
//     ];

//     if (Array.isArray(messages) && messages.length > 0) {
//       for (const m of messages) {
//         if (!m?.content || typeof m.content !== "string") continue;
//         const role =
//           m.role === "assistant" || m.role === "system" ? m.role : "user";
//         history.push({ role, content: m.content });
//       }
//     } else if (message) {
//       history.push({ role: "user", content: message });
//     }

//     // 🔥 Use correct fields for xAI Grok API
//     const response = await fetch("https://api.x.ai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "grok-beta", // ✅ use grok-beta or grok-2 (supported as of 2025)
//         messages: history,
//         temperature: 0.7,
//         max_output_tokens: 800, // ✅ correct key name
//       }),
//     });

//     // Handle API response
//     const data = await response.json();

//     if (!response.ok) {
//       console.error("Grok API error:", data);
//       return NextResponse.json(
//         { error: `Grok API error: ${data.error?.message || response.statusText}` },
//         { status: response.status }
//       );
//     }

//     const reply = data?.choices?.[0]?.message?.content || data?.output || "";

//     if (!reply) {
//       return NextResponse.json(
//         { error: "No response content from Grok API" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ reply });
//   } catch (err: any) {
//     console.error("Error in /api/chat:", err);
//     return NextResponse.json(
//       { error: `Server error: ${err.message || "Unknown error"}` },
//       { status: 500 }
//     );
//   }
// }



import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message, messages } = body as {
      message?: string;
      messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    };

    // 🧩 Input validation
    if ((!message || !message.trim()) && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 🔐 Get Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in environment" },
        { status: 500 }
      );
    }

    // 🧠 System prompt (same as before)
    const systemPrompt =
      "You are Placida, a warm, compassionate mental well-being companion. " +
      "Offer brief, empathetic reflections and gentle, practical suggestions. " +
      "Avoid medical diagnoses. Encourage seeking professional help if needed.";

    // 📜 Build message history
    const history: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages) {
        if (!m?.content || typeof m.content !== "string") continue;
        const role = ["assistant", "system"].includes(m.role)
          ? m.role
          : "user";
        history.push({ role, content: m.content });
      }
    } else if (message) {
      history.push({ role: "user", content: message });
    }

    // 🗣️ Convert messages to plain text for Gemini
    const conversationText = history
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    // 🚀 Send request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: conversationText }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    // 🧾 Parse response
    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return NextResponse.json(
        {
          error:
            data.error?.message ||
            `Gemini API error (${response.status}): ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini model.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    return NextResponse.json(
      { error: `Server error: ${err.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
