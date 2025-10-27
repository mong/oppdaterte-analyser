import { cache, Suspense } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Header from "@/components/Header";
import { Lang } from "@/types";
import { ChartContainer } from "@/components/Charts/ChartContainer";
import { getDictionary } from "@/lib/dictionaries";
import { getSubHeader, makeDateElem } from "@/lib/helpers";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import TagList from "@/components/TagList";
import DownloadDataButton from "./DownloadDataButton";
import { notFound } from "next/navigation";
import { Compare } from "@/components/Compare";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import RichText from "@/components/RichText";

//import { Compare } from "@/components/Compare";
import { createHash } from "crypto";

export const generateMetadata = async (props: {
  params: Promise<{ lang: Lang; analyseName: string; testSlug: string[] }>;
}) => {
  const { lang, analyseName, testSlug } = await props.params;

  const analyse = await queryAnalyseBySlug({ slug: analyseName, lang });

  if (!analyse) notFound();

  const tags =
    analyse.tags?.filter((tag) => typeof tag === "object" && tag !== null) ||
    [];

  const dict = await getDictionary(lang);

  return {
    title: `${analyse.title} - ${dict.general.updated_health_atlas}`,
    description: `${dict.general.updated_health_atlas}`,
    keywords: `${tags
      .map((tag) => tag.title)
      .join(", ")}, ${dict.general.metadata_keywords}`,
  };
};

export default async function AnalysePage(props: {
  params: Promise<{ lang: Lang; analyseName: string; testSlug: string[] }>;
}) {
  const { lang, analyseName, testSlug } = await props.params;
  const { isEnabled: draft } = await draftMode();

  const analyse = await queryAnalyseBySlug({ slug: analyseName, lang });

  if (!analyse || !["en", "no"].includes(lang)) {
    notFound();
  }

  const dataHash = createHash("md5")
    .update(JSON.stringify(analyse.data || ""))
    .digest("hex");

  const dict = await getDictionary(lang);

  const breadcrumbs: BreadCrumbStop[] = [
    {
      link: "https://www.skde.no",
      text: dict.breadcrumbs.homepage,
    },
    {
      link: "https://www.skde.no/helseatlas",
      text: dict.breadcrumbs.health_atlas,
    },
    {
      link: `/${lang}`,
      text: dict.breadcrumbs.updated_health_atlas,
    },
    {
      link: `/${lang}/analyse/${analyse.slug}`,
      text: analyse.title,
    },
  ];

  return (
    <>
      <Header lang={lang} breadcrumbs={breadcrumbs} title={analyse.title}>
        <Typography variant="h6" sx={{ marginY: 2 }}>
          {getSubHeader(analyse.data, lang)}
        </Typography>
        <Stack
          direction={"row"}
          spacing={2}
          sx={{ marginTop: 2, justifyContent: "space-between" }}
        >
          {analyse.tags && (
            <TagList
              tags={analyse.tags.filter(
                (tag) => typeof tag === "object" && tag !== null,
              )}
              lang={lang}
            />
          )}
          <Typography variant="body2">
            {dict.analysebox.updated}{" "}
            {makeDateElem(analyse.publishedAt || analyse.createdAt, lang)}
          </Typography>
        </Stack>
      </Header>
      <main>
        {draft && <LivePreviewListener />}
        <Container
          maxWidth="xxl"
          disableGutters={false}
          sx={{ paddingY: 4, paddingX: { xs: 2, md: 4 } }}
        >
          {analyse.test && (
            <Alert severity="warning">
              Dette er en test-side! Denne analysen er fortsatt ikke publisert.
            </Alert>
          )}
          <Suspense
            fallback={
              <Grid container justifyContent="center" sx={{ padding: 10 }}>
                <CircularProgress />
              </Grid>
            }
          >
            <Box sx={{ padding: 2 }}>
              <Typography variant="h3">{dict.analysebox.summary}</Typography>
              <RichText data={analyse.summary} enableGutter={true} />
            </Box>
            {analyse.data?.name && analyse.data.name === analyse.slug ? (
              <ChartContainer
                key={dataHash} // Providing key to update state when new files are uploaded in preview
                analyse={analyse}
                lang={lang}
                dict={dict}
              />
            ) : (
              <Alert severity="error">
                {analyse.data?.name !== analyse.slug
                  ? "Feil navn i JSON-fila (må være identisk med 'slug')"
                  : "JSON-fil mangler eller inneholder feil"}
              </Alert>
            )}

            <Typography variant="h3" sx={{ mt: 4 }}>
              {dict.analysebox.discussion}
            </Typography>
            <RichText data={analyse.discussion} enableGutter={true} />

            <Typography variant="h3" sx={{ mt: 4 }}>
              {dict.analysebox.info}
            </Typography>
            <RichText data={analyse.about} enableGutter={true} />
          </Suspense>
        </Container>
      </main>
    </>
  );
}

const queryAnalyseBySlug = cache(
  async ({ slug, lang }: { slug: string; lang: Lang }) => {
    const { isEnabled: draft } = await draftMode();

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: "analyser",
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      locale: lang,
      fallbackLocale: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    return result.docs?.[0] || null;
  },
);
