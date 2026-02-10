import type { CollectionConfig } from "payload";

import path from "path";
import { fileURLToPath } from "url";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { revalidateTag } from "next/cache";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Datafiler: CollectionConfig = {
  slug: "datafiler",
  folders: true,
  labels: {
    singular: "Datafil",
    plural: "Datafiler",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [() => revalidateTag("datafil")],
  },
  fields: [],
  upload: {
    disableLocalStorage: true,
  },
};
