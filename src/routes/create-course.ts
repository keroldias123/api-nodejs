import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Server } from "http";
import z from "zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";

export const createCourseRoute: FastifyPluginAsyncZod= async(Server)=>{
Server.post("/courses",{
  schema:{
    tags:["COURSES"],
    summary:"Create a Course",
    description:"Esta rota recebe um titulo e cria um curso no banco de dados ",
    body:z.object({
      title:z.string().min(3,{message:"Title must be at least 3 characters long"}),
      description:z.string().min(3,{message:"Description must be at least 3 characters long"})
    }),
    response:{
      201:z.object({courseId:z.uuid().describe("Curso Criado com Sucesso!")})
    }
  }
}, async (request, reply) => {

    const body = request.body;
   const result = await db.
   insert(courses).
   values({ title: body.title, description: body.description })
  .returning();

  return reply.status(201).send({ courseId: result[0].id });
});
}