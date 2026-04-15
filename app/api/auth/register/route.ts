import { prisma } from '@/prisma/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request){

    const {name,email,password} = await request.json()

    if (!await prisma.user.findUnique({where: {email}})){
            const hashedpassword = await bcrypt.hash(password,10)
            await prisma.user.create({data: {name,email,password:hashedpassword}})

        }

    return Response.json({message:"User created successfully"},{status:201})
    }
