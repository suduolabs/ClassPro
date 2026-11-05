const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const { redirect } = require("next/navigation");

function loadRoute(fetchCalendar) {
  const filename = path.join(
    __dirname,
    "../frontend/app/api/calendar/route.tsx"
  );
  const source = ts
    .transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    })
    .outputText.replaceAll(
      "import.meta.url",
      JSON.stringify(`file://${filename}`)
    );
  const exports = {};
  vm.runInNewContext(
    source,
    {
      exports,
      Response,
      URL,
      console: { warn() {} },
      require(name) {
        if (name === "@/hooks/fetchCalendar") return { fetchCalendar };
        if (name === "@/utils/Times") {
          const utils = { exports: {} };
          const code = ts.transpileModule(
            readFileSync(
              path.join(__dirname, "../frontend/utils/Times.ts"),
              "utf8"
            ),
            {
              compilerOptions: { module: ts.ModuleKind.CommonJS },
            }
          ).outputText;
          vm.runInNewContext(code, { exports: utils.exports, require });
          return utils.exports;
        }
        return require(name);
      },
    },
    { filename }
  );
  return exports.GET;
}

for (const destination of ["/invalid", "/ratelimit"]) {
  test(`calendar download preserves ${destination} redirect`, async () => {
    const GET = loadRoute(async () => redirect(destination));
    await assert.rejects(
      GET(new Request("https://classpro.test/api/calendar")),
      {
        digest: `NEXT_REDIRECT;replace;${destination};307;`,
      }
    );
  });
}

test("calendar download returns 404 for an empty calendar", async () => {
  const GET = loadRoute(async () => ({ calendar: [] }));
  const response = await GET(new Request("https://classpro.test/api/calendar"));
  assert.equal(response.status, 404);
});
