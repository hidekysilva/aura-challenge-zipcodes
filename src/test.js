const { handler } = require("./index");

describe("basic tests", () => {
  test("handler function exists", () => {
    expect(typeof handler).toBe("function");
  });

  test("handler returns success", async () => {
    await expect(handler()).resolves.toEqual("success");
  });
});
