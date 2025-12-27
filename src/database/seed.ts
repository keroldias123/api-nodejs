import chalk from "chalk";
import { db } from "./client.ts"
import { courses, enrollments, users } from "./schema.ts"
import { faker } from "@faker-js/faker";
import { hash } from "argon2";

async function seed() {
   const passwordhash= await hash("123456")
    const insertuser= await db.insert(users).values([
        {
          name:faker.person.fullName(),
          email:faker.internet.email(),
          password:passwordhash,
          role:faker.helpers.arrayElement(["student","manager"])},
         {
          name:faker.person.fullName(),
          email:faker.internet.email(),
          password:passwordhash,
          role:faker.helpers.arrayElement(["student","manager"])
        },
        {
          name:faker.person.fullName(),
          email:faker.internet.email(),
          password:passwordhash,
          role:faker.helpers.arrayElement(["student","manager"])
        },
        ]).returning();

    const insertcourse= await db.insert(courses).values([
         {title:faker.lorem.words(4)},
         {title:faker.lorem.words(4)},
        ]
    ).returning();
    
  await db.insert(enrollments).values([
  { courseId: insertcourse[0].id, userId: insertuser[0].id },
  { courseId: insertcourse[0].id, userId: insertuser[1].id },
  { courseId: insertcourse[1].id, userId: insertuser[2].id },
]);


    console.log(chalk.green("seed actualizado com sucesso ! "))
    

}

seed().then(()=>process.exit(0)).catch((error)=>{
    console.error(error);
    process.exit(1);
});