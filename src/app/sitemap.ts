import { getAllAnalyser, getKompendier } from "@/services/mongo";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kompendier = await getKompendier();
  const analyser = (await getAllAnalyser()).filter(
    (analyse) => analyse.name !== "skulder",
  );

  return [
    {
      url: "https://analyser.skde.no",
      lastModified: analyser
        .map((analyse) => analyse.updatedAt)
        .reduce((acc, val) => (acc > val ? acc : val)),
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
        lastModified: analyser
          .filter((analyse) => analyse.tags.includes(komp.name))
          .map((analyse) => analyse.updatedAt)
          .reduce((acc, val) => (acc > val ? acc : val)),
        alternates: {
          languages: {
            en: `https://analyser.skde.no/en/${komp.name}`,
            no: `https://analyser.skde.no/no/${komp.name}`,
          },
        },
      })),
    )
    .concat(
      analyser.map((analyse) => ({
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
