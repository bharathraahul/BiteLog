import { verifyToken } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";

export async function GET(request:Request){
    try{
        const header = await verifyToken(request)
        const meals = await prisma.meal.findMany({where: {userId:header.userId}})
        return Response.json(meals, {status:200})
    }catch(error){
        return Response.json({message:"Unauthorized"},{status:401})
    }
}