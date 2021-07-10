import { serveSinglePage } from "https://deno.land/x/surv@v0.1.2/recipe.ts";

if (import.meta.main) {
  await serveSinglePage({
    server: "serve.ts",
    ws: {
      hostname: "localhost",
      port: 1234,
    },
    html: {
      title: "Lucifer",
    },
  });
}
