import { assertEquals } from "$std/assert/assert_equals.ts";
import { archive } from "../content-manager.ts";

Deno.test("archive test", async function connectionTest() {
  await archive();

  assertEquals(true, true);
});
