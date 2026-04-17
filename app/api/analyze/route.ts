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
}