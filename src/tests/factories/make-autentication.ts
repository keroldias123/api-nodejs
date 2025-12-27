import { makeUser } from "./make-user.ts";
import jwt from "jsonwebtoken";
export async function makeAutenticationUser(role:"student" | "manager"){
    const user=await makeUser(role);

    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not defined");
    }

    const token=jwt.sign({sub:user.User.id,role:user.User.role},process.env.JWT_SECRET!,{
        expiresIn:"1h",
    })
    return {
        user,
        token,
    }
}