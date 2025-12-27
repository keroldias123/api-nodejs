 import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { getAuthorizationFromRequest } from "../../utils/get-authorization-from-request.ts";

// export async function checkUserRole(request: FastifyRequest, reply: FastifyReply) {
//    const user=getAuthorizationFromRequest(request);
//    if(user.role !== "manager"){
//     return reply.status(401).send({ error: "Unauthorized" });
//    }
//    return user;
// }

export  function checkUserRole(role:"student" | "manager") {
   return async function (request: FastifyRequest, reply: FastifyReply) {
    const user=getAuthorizationFromRequest(request);
    if(user.role !== role){
     return reply.status(401).send({ error: "Unauthorized" });
    }
    return user;
   }
}