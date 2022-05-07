import request from "supertest";
import { app } from "../../app";

it("returns 400 on unregistered email", async () => {
  return request(app)
    .post(`/api/users/signin`)
    .send({ email: "test@test.com", password: "123123123" })
    .expect(400);
});

it("returns 201 on successful login", async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({ email: "test@test.com", password: "123123123" })
    .expect(201);

  const res = await request(app)
    .post(`/api/users/signin`)
    .send({ email: "test@test.com", password: "123123123" })
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});
