import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileName, mimeType } = await req.json();

    if (!fileBase64 || !fileName) {
      return new Response(
        JSON.stringify({ error: 'File data and filename are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing document: ${fileName}, type: ${mimeType}`);

    // Decode base64 to binary
    const binaryString = atob(fileBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    let extractedText = "";

    // Handle different file types
    if (mimeType === "text/plain" || fileName.endsWith(".txt")) {
      // Plain text - decode directly
      extractedText = new TextDecoder().decode(bytes);
    } else if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
      // For PDF files, use AI to extract text
      extractedText = await extractTextWithAI(fileBase64, fileName, "PDF");
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword" ||
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc")
    ) {
      // For Word documents, use AI to extract text
      extractedText = await extractTextWithAI(fileBase64, fileName, "Word document");
    } else {
      // Try to decode as text for unknown types
      try {
        extractedText = new TextDecoder().decode(bytes);
      } catch {
        return new Response(
          JSON.stringify({ error: `Unsupported file type: ${mimeType}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'No text content could be extracted from the document' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully extracted ${extractedText.length} characters from ${fileName}`);

    return new Response(
      JSON.stringify({ success: true, text: extractedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in parse-document function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function extractTextWithAI(fileBase64: string, fileName: string, fileType: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    throw new Error("AI service not configured");
  }

  console.log(`Using AI to extract text from ${fileType}: ${fileName}`);

  // Use Gemini's vision capabilities to extract text from documents
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are a document text extraction assistant. Your task is to extract ALL text content from the provided ${fileType} document. 
          
Rules:
- Extract every piece of text exactly as it appears
- Preserve the structure and formatting (headers, paragraphs, bullet points)
- Include all sections: personal info, experience, education, skills, etc.
- Do not summarize or interpret - just extract the raw text
- If the document appears to be a resume/CV, extract all details including contact information, job titles, dates, descriptions
- Return ONLY the extracted text, no commentary or explanations`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract all text content from this ${fileType} document named "${fileName}". Return only the extracted text.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${fileBase64}`
              }
            }
          ]
        }
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    if (response.status === 402) {
      throw new Error("AI usage limit reached. Please add credits to continue.");
    }
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    throw new Error("Failed to extract text from document");
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned empty response");
  }

  return content.trim();
}
