import fastify from "fastify";
import {  serializerCompiler, validatorCompiler, type ZodTypeProvider,jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import scalarAPIReference from "@scalar/fastify-api-reference";
import { createCourseRoute } from "./routes/create-course.ts";
import { GetCourseRoute } from "./routes/get-course.ts";
import { GetCourseByIdRoute } from "./routes/get-course-by-id.ts";
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

if (process.env.NODE_ENV==='development') {
    
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
    
    // Server.register(fastifySwaggerUi,{
    //   routePrefix: "/docs",
    // });
     Server.register(scalarAPIReference, { routePrefix: '/docs',})
}

Server.setSerializerCompiler(serializerCompiler);
Server.setValidatorCompiler(validatorCompiler);

Server.register(createCourseRoute);
Server.register(GetCourseRoute);
Server.register(GetCourseByIdRoute);

export {Server};  