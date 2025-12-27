import type{ FastifyRequest } from "fastify";

export function getAuthorizationFromRequest(request: FastifyRequest){
const user=request.user;
if(!user){
    throw new Error("Unauthorized");
}
return user;
}
