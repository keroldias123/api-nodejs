import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";

export const GetCourseRoute: FastifyPluginAsyncZod= async(Server)=>{
Server.get("/courses",{
  schema:{
     tags:["COURSES"],
    summary:"Get all Course",
    response:{
      200:z.object({
        courses:z.array(z.object({
          id:z.uuid(),
        title:z.string(),
        }))
      })
    }
  }
}, async (request, reply) => {
  const result = await db.select({id: courses.id, title: courses.title}).from(courses);
  return { courses: result };
});
}