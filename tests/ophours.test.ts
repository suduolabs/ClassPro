import { beforeEach, describe, expect, it, vi } from "vitest";

const update = vi.fn((..._args: unknown[]) => ({ error: null }));
const from = vi.fn(() => ({
  update: (...args: unknown[]) => {
    update(...(args as []));
    return { eq: () => ({ error: null }) };
  },
}));

vi.mock("@/utils/Database/supabase", () => ({
  supabase: { from },
}));
vi.mock("@/utils/Cookies", () => ({ encode: () => "encoded" }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: "session" }) }),
}));

describe("POST /api/ophours", () => {
  beforeEach(() => {
    update.mockClear();
  });

  it("normalizes and validates optional hours before persistence", async () => {
    const { POST } = await import("@/app/api/ophours/route");
    const response = await POST(
      new Request("https://classpro.test/api/ophours", {
        method: "POST",
        body: JSON.stringify({ ophours: ["D1-H3", " D1-H3 ", "D8-H99"] }),
      })
    );

    expect(response.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it("persists a deduplicated valid selection", async () => {
    const { POST } = await import("@/app/api/ophours/route");
    const response = await POST(
      new Request("https://classpro.test/api/ophours", {
        method: "POST",
        body: JSON.stringify({ ophours: ["d1-h3", " D1-H3 "] }),
      })
    );

    await expect(response.json()).resolves.toEqual({ success: true });
    expect(update).toHaveBeenCalledWith({ ophour: "D1-H3" });
  });
});
