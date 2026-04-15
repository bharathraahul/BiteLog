import { prisma } from "@/prisma/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export async function Login(request: Request, response: Response){
    const {email,password} = await request.json()

    const existingUser = await prisma.user.findUnique({where: {email}})

    if (existingUser){
        if (await bcrypt.compare(password,existingUser.password)){
            const token = jwt.sign(
                {userId : existingUser.id},
                process.env.JWT_SECRET!,
                {expiresIn:'7d'}
            )
            return Response.json({message:"Login Successful", token},{status:200})
        }
    }

    return Response.json({message:"Invalid email or password"},{status:401})
}
