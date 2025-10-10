import { getAnalyser } from "@/services/mongo";
import { getPayloadKompendier } from "@/services/payload";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kompendier = await getPayloadKompendier({ lang: 'no' });
  const analyser = await getAnalyser();

  return [
    {
      url: "https://analyser.skde.no",
      lastModified: analyser
        .map((analyse) => analyse.createdAt)
        .reduce(
          (acc, val) => (acc > new Date(val) ? acc : new Date(val)),
          new Date(0),
        ),
      alternates: {
        languages: {
          en: "https://analyser.skde.no/en",
        },
      },
    },
  ]
    .concat(
      kompendier.map((komp) => ({
        url: `https://analyser.skde.no/no/${komp.identifier}`,
        lastModified: analyser
          .filter((analyse) => analyse.tags.includes(komp.identifier))
          .map((analyse) => analyse.createdAt)
          .reduce(
            (acc, val) => (acc > new Date(val) ? acc : new Date(val)),
            new Date(0),
          ),
        alternates: {
          languages: {
            en: `https://analyser.skde.no/en/${komp.identifier}`,
            no: `https://analyser.skde.no/no/${komp.identifier}`,
          },
        },
      })),
    )
    .concat(
      analyser.map((analyse) => ({
        url: `https://analyser.skde.no/no/analyse/${analyse.name}`,
        lastModified: new Date(analyse.createdAt),
        alternates: {
          languages: {
            en: `https://analyser.skde.no/en/analyse/${analyse.name}`,
            no: `https://analyser.skde.no/no/analyse/${analyse.name}`,
          },
        },
      })),
    );
}
