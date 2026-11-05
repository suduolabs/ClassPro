// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ value: "session" }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => (session.value ? { value: session.value } : undefined),
  }),
}));
vi.mock("@/utils/Tokenize", () => ({ token: () => "validation" }));
vi.mock("@/utils/URL", () => ({ default: () => "https://academic.test" }));

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
  session.value = "session";
});

it("redirects an expired calendar session instead of caching the error", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(Response.json({ tokenInvalid: true, calendar: [] }))
    .mockResolvedValueOnce(
      Response.json({ calendar: [{ month: "Aug '26", days: [] }] })
    );
  vi.stubGlobal("fetch", fetch);
  const { default: fetchCalendar } = await import("@/hooks/fetchCalendar");
  await expect(fetchCalendar()).rejects.toMatchObject({
    digest: expect.stringContaining("/invalid;"),
  });
  await expect(fetchCalendar()).resolves.toMatchObject({
    calendar: [{ month: "Aug '26", days: [] }],
  });
});

it("requires a session even when the shared calendar cache is populated", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        Response.json({ calendar: [{ month: "Aug '26", days: [] }] })
      )
  );
  const { default: fetchCalendar } = await import("@/hooks/fetchCalendar");
  await fetchCalendar();
  session.value = "";
  await expect(fetchCalendar()).rejects.toMatchObject({
    digest: expect.stringContaining("/auth/login;"),
  });
});
