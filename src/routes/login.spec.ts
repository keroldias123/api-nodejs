import { describe, expect, test } from "vitest";
import request from "supertest";
import { Server } from "../app.ts";
import { makeUser } from "../tests/factories/make-user.ts";

describe("Login", () => {
    test("should return 200 if user is authenticated", async () => {
        await Server.ready();
        const { User,passwordWithOutHash } = await makeUser();
        const response = await request(Server.server)
            .post("/session")
            .send({
                email: User.email,
                password: passwordWithOutHash,
            })
            .expect(200);
        expect(response.body).toEqual({
            token:expect.any(String),
        });
    });
});