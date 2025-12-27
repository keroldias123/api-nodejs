import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Server } from "http";
import z from "zod";
import { db } from "../database/client.ts";
import {  users } from "../database/schema.ts";
import { eq } from "drizzle-orm";
import { verify } from "argon2";
import jwt from "jsonwebtoken";
import { env } from "process";
export const LoginRoute: FastifyPluginAsyncZod= async(Server)=>{
Server.post("/session",{
  schema:{
    tags:["AUTH"],
    summary:"Login",
    description:"Esta rota recebe um email e uma senha e retorna um token de autenticação",
    body:z.object({
      email:z.string().email(),
      password:z.string().min(6)
    }),
    response:{
      200:z.object({token:z.string()}),
      400:z.object({message:z.string()})
    }
  }
}, async (request, reply) => {

    const body = request.body;
    const result= await db.select().from(users).where(eq(users.email,body.email));

    if(result.length===0){
      return reply.status(400).send({ message: "Unauthorized" });
    }
     const user=result[0];
    const isPasswordValid= await verify(user.password,body.password); 

    if(!isPasswordValid){
      return reply.status(400).send({ message: "Unauthorized" });
    }

    if(!env.JWT_SECRET){
      throw new Error("JWT_SECRET is not defined");
    }
    const token=jwt.sign({sub:user.id,role:user.role},env.JWT_SECRET);

  return reply.status(200).send({ token });
});
}