import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import { nb } from "@payloadcms/translations/languages/nb";
import { Media } from "./collections/Media";
import { Datafiler } from "./collections/Datafiler";
import { Users } from "./collections/Users";
import { Tags } from "./collections/Tags";
import { Rapporter } from "./collections/Rapporter";
import { Analyser } from "./collections/Analyser";
import { getServerSideURL } from "./utilities/getURL";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {},
  editor: lexicalEditor(),
  collections: [Rapporter, Analyser, Users, Datafiler, Media, Tags],
  localization: {
    locales: ["en", "no"],
    defaultLocale: "no",
  },
  serverURL: getServerSideURL(),
  i18n: {
    supportedLanguages: { nb },
  },
  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || "",
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  indexSortableFields: true,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  // db: mongooseAdapter({
  //   url: process.env.DATABASE_URI || ""
  // }),
  sharp, // <- If you want to resize images, crop, set focal point, etc.
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
