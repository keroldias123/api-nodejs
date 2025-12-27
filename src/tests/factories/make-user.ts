import { faker } from "@faker-js/faker";
import { hash } from "argon2";
import { randomUUID } from "node:crypto";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
export async function makeUser( role?:"student" | "manager"){
    const passwordWithOutHash=await randomUUID();
    const passwordHash=await hash(passwordWithOutHash);
    const result=await db.insert(users).values({
        name:faker.person.fullName(),
        email:faker.internet.email(),
        password:passwordHash,
        role,
    }).returning();
    return {
       User:result[0],
       passwordWithOutHash,
    }   
}