import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";
import { eq } from "drizzle-orm";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { getAuthorizationFromRequest } from "../utils/get-authorization-from-request.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";
export const GetCourseByIdRoute: FastifyPluginAsyncZod= async(Server)=>{
Server.get("/courses/:id",{
  preHandler:[
    checkRequestJWT,
    checkUserRole("student")
  ],
  schema:{
     tags:["COURSES"],
    summary:"Get Course By Id ",
     params:z.object({
      id:z.uuid(),
    }),
    response:{
      200:z.object({
        course:z.object({
          id:z.uuid(),
        title:z.string(),
        description:z.string().nullable(),
        })
      }),
      404:z.null().describe("Course not Found"),
    },
  },
}, async (request, reply) => {
  const user=getAuthorizationFromRequest(request);
  const courseId = request.params.id;
console.log(request.user);
 const result = await db.select()
 .from(courses)
 .where(eq(courses.id, courseId));
 
  if (result.length > 0) {
    return { course: result[0] };
  }
  return reply.status(404).send();
});
}