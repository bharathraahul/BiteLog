import jwt from "jsonwebtoken"


export async function verifyToken(request:Request){

    const authHeader  = request.headers.get("authorization")

    if (!authHeader){
        throw new Error("Missing Authorization Header")
    }

    const authToken = authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(authToken,process.env.JWT_SECRET!)
        return decoded

    }catch{
        throw new Error("Invalid or expired token")
    }

}



