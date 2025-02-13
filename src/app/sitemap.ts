import { getAllAnalyser, getKompendier } from "@/services/mongo";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kompendier = await getKompendier();
  const analyser = await getAllAnalyser();

  return [
    {
      url: "https://analyser.skde.no",
      lastModified: new Date(),
      alternates: {
        languages: {
          en: "https://analyser.skde.no/en",
        },
      },
    },
  ]
    .concat(
      kompendier.map((komp) => ({
        url: `https://analyser.skde.no/no/${komp.name}`,
        lastModified: new Date(),
        alternates: {
          languages: {
            en: `https://analyser.skde.no/en/${komp.name}`,
            no: `https://analyser.skde.no/no/${komp.name}`,
          },
        },
      })),
    )
    .concat(
      analyser
        .filter((analyse) => analyse.name !== "skulder")
        .map((analyse) => ({
          url: `https://analyser.skde.no/no/analyse/${analyse.name}`,
          lastModified: new Date(analyse.updatedAt),
          alternates: {
            languages: {
              en: `https://analyser.skde.no/en/analyse/${analyse.name}`,
              no: `https://analyser.skde.no/no/analyse/${analyse.name}`,
            },
          },
        })),
    );
}
