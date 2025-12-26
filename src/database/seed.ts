import chalk from "chalk";
import { db } from "./client.ts"
import { courses, enrollments, users } from "./schema.ts"
import { faker } from "@faker-js/faker";

async function seed() {
   
    const insertuser= await db.insert(users).values([
        {name:faker.person.fullName(),email:faker.internet.email()},
         {name:faker.person.fullName(),email:faker.internet.email()},
          {name:faker.person.fullName(),email:faker.internet.email()},
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

seed();