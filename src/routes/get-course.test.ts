import { describe, test, expect } from "vitest";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { Server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { randomUUID } from "node:crypto";

describe("GET /courses", () => {
  test("should return a list of courses", async () => {
    await Server.ready();
    const titlid=randomUUID()
    const course= await makeCourse(titlid)
    const response = await request(Server.server)
      .get(`/courses?search=${titlid}`)
      
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        {
          total:1,
          courses:[{
            id:expect.any(String),
            title:titlid,
            enrollments:0
          }]
        }
      )

   
  });
});