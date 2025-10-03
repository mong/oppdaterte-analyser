import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig } from "payload";
import { nb } from "@payloadcms/translations/languages/nb";
import { Media } from "./collections/Media";
import { Datafiler } from "./collections/Datafiler";
import { Users } from "./collections/Users";
import { Tags } from "./collections/Tags";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    autoLogin:
      process.env.NODE_ENV === "development"
        ? {
            email: "test@example.com",
            password: "test",
            prefillOnly: false,
          }
        : false,
  },
  editor: lexicalEditor(),
  collections: [Media, Datafiler, Users, Tags],
  localization: {
    locales: ["en", "nb", "nn"],
    defaultLocale: "nb",
  },
  i18n: {
    supportedLanguages: { nb },
  },
  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || "",
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.PAYLOAD_URI || "",
  }),
  sharp, // <- If you want to resize images, crop, set focal point, etc.
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
