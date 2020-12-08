const { handler } = require("./index");
const data = require("./data.json");

describe("basic tests", () => {
  test("handler function exists", () => {
    expect(typeof handler).toBe("function");
  });

  test("handler returns array of length data.length", async () => {
    await expect(
      handler({ httpMethod: "GET", path: "/zip", queryStringParameters: {} })
    ).resolves.toHaveLength(data.length);
  });

  test("handler throws when given invalid event", async () => {
    await expect(handler("event")).rejects.toThrow();
  });

  test("handler throws when given invalid httpMethod", async () => {
    await expect(
      handler({
        httpMethod: "FIND",
        path: "/zip",
        queryStringParameters: { zip: "010" },
      })
    ).rejects.toThrow();
  });

  test("handler throws when given invalid path", async () => {
    await expect(
      handler({
        httpMethod: "GET",
        path: "/zap",
        queryStringParameters: { zip: "010" },
      })
    ).rejects.toThrow();
  });

  test("handler throws when given invalid queryStringParameters", async () => {
    await expect(
      handler({
        httpMethod: "GET",
        path: "/zip",
        queryStringParameters: null,
      })
    ).rejects.toThrow();
  });

  test("handler returns empty array", async () => {
    await expect(
      handler({
        httpMethod: "GET",
        path: "/zip",
        queryStringParameters: { zip: "99999" },
      })
    ).resolves.toEqual([]);
  });

  test("handler throws when zip param is less than 3 characters", async () => {
    await expect(
      handler({
        httpMethod: "GET",
        path: "/zip",
        queryStringParameters: { zip: "01" },
      })
    ).rejects.toThrow();
  });

  test("handler returns non-empty array when given a valid zip param", async () => {
    const result = await handler({
      httpMethod: "GET",
      path: "/zip",
      queryStringParameters: { zip: "061" },
    });

    await expect(Array.isArray(result)).toBe(true);

    await expect(result.length).toBeGreaterThan(0);
  });

  test("handler returns non-empty array when given a valid primary_city param", async () => {
    const result = await handler({
      httpMethod: "GET",
      path: "/zip",
      queryStringParameters: { primary_city: "New Haven" },
    });

    await expect(Array.isArray(result)).toBe(true);

    await expect(result.length).toBeGreaterThan(0);
  });

  test("handler returns non-empty array when given a valid county param", async () => {
    const result = await handler({
      httpMethod: "GET",
      path: "/zip",
      queryStringParameters: { county: "Worcester" },
    });

    await expect(Array.isArray(result)).toBe(true);

    await expect(result.length).toBeGreaterThan(0);
  });

  test("handler returns non-empty array when given a valid latitude param", async () => {
    const result = await handler({
      httpMethod: "GET",
      path: "/zip",
      queryStringParameters: { latitude: "42.0" },
    });

    await expect(Array.isArray(result)).toBe(true);

    await expect(result.length).toBeGreaterThan(0);
  });

  test("handler returns non-empty array when given a valid longitude param", async () => {
    const result = await handler({
      httpMethod: "GET",
      path: "/zip",
      queryStringParameters: { longitude: "-72.0" },
    });

    await expect(Array.isArray(result)).toBe(true);

    await expect(result.length).toBeGreaterThan(0);
  });

  test("handler returns non-empty array when given a valid estimated_population param", async () => {
    const result = await handler({
      httpMethod: "GET",
      path: "/zip",
      queryStringParameters: { estimated_population: "900" },
    });

    await expect(Array.isArray(result)).toBe(true);

    await expect(result.length).toBeGreaterThan(0);
  });
});
