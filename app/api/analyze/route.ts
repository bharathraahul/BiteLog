import { verifyToken } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

const meal1 = await prisma.meal.create({
    data: {
        name: nutrition.name,
    }
})

const Food = await prisma.food.upsert({
    where: {name: nutrition.name},
    update:{},
    create:{name:nutrition.name}
    
})

const mealFood = await prisma.mealFood.create({
    data: {
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        quantity: nutrition.quantity || 1,
        meal: {
            connect: {id: (await meal1).id}
        },
        food:{
            connect:{id:Food.id}
        }
    }
})

return Response.json({message:"Meal analyzed and saved", meal: await meal1, nutrition: await mealFood}, {status:200})
}