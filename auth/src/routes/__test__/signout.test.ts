import request from "supertest";
import { app } from "../../app";

it("returns 200", async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({ email: "test@test.com", password: "123123123" })
    .expect(201);

  await request(app).post(`/api/users/signout`).expect(200);
});
