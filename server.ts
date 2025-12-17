import fastify from "fastify";
import crypto from "node:crypto";
import { courses } from "./src/database/schema.ts";
import { db } from "./src/database/client.ts";
import { eq } from "drizzle-orm";
import {  serializerCompiler, validatorCompiler, type ZodTypeProvider,jsonSchemaTransform } from "fastify-type-provider-zod";
import z from "zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
const Server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

Server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API NodeJS",
      description: "API NodeJS",
      version: "1.0.0",
    },
  },
  transform:jsonSchemaTransform,
});

Server.register(fastifySwaggerUi,{
  routePrefix: "/docs",
});

Server.setSerializerCompiler(serializerCompiler);
Server.setValidatorCompiler(validatorCompiler);
// const courses = [
//   { id: 1, name: "course1" },
//   { id: 2, name: "course2" },
//   { id: 3, name: "course3" },
// ];

Server.get("/", async (request, reply) => {
  return { hello: "world" };
});

Server.get("/courses", async (request, reply) => {
  const result = await db.select({id: courses.id, title: courses.title}).from(courses);
  return { courses: result };
});

Server.get("/courses/:id",{
  schema:{
    params:z.object({
      id:z.uuid(),
    })
  }
}, async (request, reply) => {
  const courseId = request.params.id;

 const result = await db.select({id: courses.id, title: courses.title}).from(courses).where(eq(courses.id, courseId));
  if (result.length > 0) {
    return { course: result[0] };
  }
  return reply.status(404).send();
});
// > Greater than
// < Less than
// >= Greater than or equal to
// <= Less than or equal to
// = Equal to
// != Not equal to
// > Greater than
// < Less than
// >= Greater than or equal to
// <= Less than or equal to
// = Equal to
// != Not equal to
// ilike
// like
// in
// between
// is
// isNot
// isNull
// isNotNull
// isEmpty
// isNotEmpty


Server.put("/courses/:id"
  ,{
schema:{
  body: z.object({
    title: z.string(),
    description: z.string(),
   }

),
params: z.object({
  id: z.string(),
})
}
}, async (request, reply) => {

  const params = request.params;
  const courseId = params.id;
 const result = await db.select().from(courses).where(eq(courses.id, courseId));
  if (result.length > 0) {
    return { course: result[0] };
  }
  return reply.status(404).send();
});

Server.post("/courses",{
  schema:{
    body:z.object({
      title:z.string().min(3,{message:"Title must be at least 3 characters long"}),
      description:z.string().min(3,{message:"Description must be at least 3 characters long"})
    })
  }
}, async (request, reply) => {

    const body = request.body;
   const result = await db.
   insert(courses).
   values({ title: body.title, description: body.description })
  .returning();
  if (!result) {
    return reply.status(400).send({ error: "Course title is required" });
  }
  return reply.status(201).send({ course: result[0].id });
});

Server.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    Server.log.error(err)
    process.exit(1)
  }
  Server.log.info(`server listening on ${address} docs: http://localhost:3000/docs`)
})
