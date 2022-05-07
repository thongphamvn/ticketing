import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";

it("get current user", async () => {
  const cookie = await signin();

  await request(app)
    .get(`/api/users/currentuser`)
    .set("Cookie", cookie)
    .expect(200)
    .expect(({ body }) => {
      expect(body).toEqual({
        currentUser: expect.objectContaining({ email: "test@test.com" }),
      });
    });
});
