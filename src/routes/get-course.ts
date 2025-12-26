import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { courses, enrollments } from "../database/schema.ts";
import { db } from "../database/client.ts";
import { and, asc, count, eq, ilike, SQL } from "drizzle-orm";

// direrença do Ilike mesmo que a pesquisa for CursoDE react ele encontra do Like

// search Params / Route Params / Request Body / Headers

// used search Params for filter data is opicional ... 
export const GetCourseRoute: FastifyPluginAsyncZod= async(Server)=>{
Server.get("/courses",{
  schema:{
     tags:["COURSES"],
    summary:"Get all Course",
    querystring:z.object({ // search params Query String 
      search: z.string().optional(),
      orderBy: z.enum(['title']).optional().default('title'),
      page: z.coerce.number().optional().default(1) // coerse begin with a number convert for(number,boolean,data,string)
    }),
    response:{
      200:z.object({
        courses:z.array(z.object({
          id:z.uuid(),
        title:z.string(),
        enrollments:z.number(),
        })
      ),
      total: z.number()
      })
    }
  }
}, async (request, reply) => {
  const{search,orderBy,page}=request.query;

  const conditions:SQL[]= [];

  if (search) {
    conditions.push(ilike(courses.title,`%${search}%`))
  }
// Leftjoin ele precisa apenas o lado esquerdo da relação 
  // innerjoin- precisa que os dois lados exista ou seja curso que não tem nenhuma matricula serão removidos
const[result,total]=await Promise.all([
db.select({id: courses.id, title: courses.title,enrollments:count(enrollments.id)})
  .from(courses)
  .leftJoin(enrollments,eq(enrollments.courseId,courses.id))
  .orderBy(asc(courses[orderBy]))
  .offset((page-1)*2)
  .limit(10)
  .where(and(...conditions))
  .groupBy(courses.id), 
  db.$count(courses,and(...conditions))
])

// o and garante que todas condições estão satisfeitas 
  // const result = await db.select({id: courses.id, title: courses.title})
  // .from(courses)
  // .orderBy(asc(courses[orderBy]))
  // .offset((page-1)*2)
  // .limit(2)
  // .where(
  //  search ? ilike(courses.title,`%${search}%`) : undefined
  // );

//  const total= await db.$count(courses, search ? ilike(courses.title,`%${search}%`) : undefined)
  return { courses: result,total };
});
}