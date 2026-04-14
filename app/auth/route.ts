import { prisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request){

    const {name,email,password} = await request.json()

    if (!await prisma.user.findUnique({where: {email}})){
            const hashedpassword = await bcrypt.hash(password,10)
            await prisma.user.create({data: {name,email,password:hashedpassword}})

        }

    return Response.json({message:"User created successfully"},{status:201})

}
    
export async function GET(request: Request,response: Response){

    const existingUser = await prisma.user.findUnique({where: {email}})

    if (existingUser){
        return Response.json({ message: "User already exists" }, { status: 400 });
    }

}

export async function Login(request: Request, response: Response){
    const {email,password} = await request.json()

    const existingUser = await prisma.user.findUnique({where: {email}})

    if (existingUser){
        if (await bcrypt.compare(password,existingUser.password)){
            return Response.json({message:"Login Successful"},{status:200})
        }
    }

    return Response.json({message:"Invalid email or password"},{status:401})
}