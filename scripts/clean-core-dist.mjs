import { rm } from "node:fs/promises";

// Remove prior compiler output so deleted internal artwork cannot linger in npm packs.
await rm(new URL("../packages/chaos-ui/dist/", import.meta.url), {
  recursive: true,
  force: true,
});
