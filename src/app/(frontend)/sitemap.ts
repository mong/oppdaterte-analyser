import { getAnalyser, getKompendier } from "@/services/payload";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kompendier = await getKompendier({ lang: "no" });
  const analyser = await getAnalyser({ lang: "no" });

  return [
    {
      url: "https://analyser.skde.no",
      lastModified: analyser
        .map((analyse) => analyse.publishedAt || analyse.createdAt)
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
          .filter((analyse) =>
            analyse.tags
              ?.filter((tag) => !(typeof tag === "string"))
              .map((tag) => tag.identifier)
              .includes(komp.identifier),
          )
          .map((analyse) => analyse.publishedAt || analyse.createdAt)
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
        url: `https://analyser.skde.no/no/analyse/${analyse.slug}`,
        lastModified: new Date(analyse.publishedAt || analyse.createdAt),
        alternates: {
          languages: {
            en: `https://analyser.skde.no/en/analyse/${analyse.slug}`,
            no: `https://analyser.skde.no/no/analyse/${analyse.slug}`,
          },
        },
      })),
    );
}
