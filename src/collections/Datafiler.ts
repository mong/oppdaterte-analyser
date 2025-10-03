import type { CollectionConfig } from "payload";

import path from "path";
import { fileURLToPath } from "url";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Datafiler: CollectionConfig = {
  slug: "json",
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
  fields: [],
  upload: {
    staticDir: path.resolve(dirname, "../../data"),
  },
};
