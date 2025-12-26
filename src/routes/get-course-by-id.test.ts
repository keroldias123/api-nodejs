import { describe, test, expect } from "vitest";
import request from "supertest";

import { faker } from "@faker-js/faker";
import { Server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";


describe("GET /courses/:id", () => {
  test("should return a course by id", async () => {
    await Server.ready();
    const course= await makeCourse()
    const response = await request(Server.server)
      .get(`/courses/${course.id}`)
      
    console.log(response.body);
    expect(response.status).toEqual(200);

    expect(response.body).toEqual({
     course:{
        id:expect.any(String),
        title:expect.any(String),
        description:null,
     }
    });
  });
});

test("should return 404 if course not found", async () => {
  await Server.ready();
  const response = await request(Server.server)
    .get(`/courses/${faker.string.uuid()}`)
    .expect(404);
});