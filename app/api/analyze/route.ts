import { verifyToken } from "@/lib/auth"

export async function POST(request:Request){

    const isLoggenIn = await verifyToken(request)
    const formData = await request.formData()
    const image = formData.get("image")
    if(!image){
        return Response.json({error:"No image provided"},{status:400})

    }
    const buffer = await (image as File).arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const mimeType = (image as File).type 

    const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: mimeType,
                            data: base64
                        }
                    },
                    {
                        type: "text",
                        text: "Analyze this food image and return ONLY a JSON object with these fields: { name, calories, protein, carbs, fat }. No extra text."
                    }
                ]
            }
        ]
    })
})

const data = await response.json()
const nutrition = JSON.parse(data.content[0].text)
}