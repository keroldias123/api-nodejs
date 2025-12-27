import { test,expect } from "vitest";
import  request  from "supertest";
import { Server } from "../app.ts";
import { faker } from "@faker-js/faker";
import { makeAutenticationUser } from "../tests/factories/make-autentication.ts";
// function soma(a:number,b:number){
//     return a + b
// }

// test("criar um curso com sucesso",()=>{
//     const result= soma(1,2) 

//     expect(result).toEqual(3)
// })
test("Create a course",async()=>{
    await Server.ready();
    const {token}=await makeAutenticationUser("manager")
 const response=await request(Server.server)
 .post('/courses')
 .set('Content-Type','application/json')
 .set('Authorization',`${token}`)
 .send({title:faker.lorem.words(4),description:faker.lorem.sentence(10)})

 console.log(response.body);
 expect(response.status).toEqual(201);
 expect(response.body).toEqual({
    courseId:expect.any(String),
 })
})