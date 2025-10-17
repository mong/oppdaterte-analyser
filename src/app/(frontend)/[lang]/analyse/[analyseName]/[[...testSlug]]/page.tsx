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
import { HeaderTop } from "@/components/Header";
import { Analyse, Lang } from "@/types";
import { ChartContainer } from "@/components/Charts/ChartContainer";
import { getDictionary } from "@/lib/dictionaries";
import { makeDateElem } from "@/lib/helpers";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import TagList from "@/components/TagList";
import DownloadDataButton from "./DownloadDataButton";
import { notFound } from "next/navigation";
import { Compare } from "@/components/Compare";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { LivePreviewListener } from "@/components/LivePreviewListener";
import RichText from "@/components/RichText";

//import { Compare } from "@/components/Compare";



export const generateMetadata = async (props: {
  params: Promise<{ lang: Lang; analyseName: string; testSlug: string[] }>;
}) => {
  const { lang, analyseName, testSlug } = await props.params;

  const payload_analyse = await queryAnalyseBySlug({ slug: analyseName, lang })

  if (!payload_analyse) notFound();

  const tags = payload_analyse.tags?.filter((tag) => typeof tag === 'object' && tag !== null) || [];

  const dict = await getDictionary(lang);

  return {
    title: `${payload_analyse.title} - ${dict.general.updated_health_atlas}`,
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
  // const { testPage, analyse } = await getCorrectAnalyse(analyseName, testSlug);

  const { isEnabled: draft } = await draftMode()

  const payload_analyse = await queryAnalyseBySlug({ slug: analyseName, lang })

  if (!payload_analyse || !["en", "no"].includes(lang)) {
    notFound();
  }


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
      link: `/${lang}/analyse/${payload_analyse.slug}`,
      text: payload_analyse.title,
    },
  ];

  return (
    <>
      <HeaderTop breadcrumbs={breadcrumbs} lang={lang}></HeaderTop>
      <main>
        {draft && <LivePreviewListener />}
        <Container
          maxWidth="xxl"
          disableGutters={false}
          sx={{ paddingBottom: 4, paddingX: { xs: 2, md: 4 } }}
        >
          {payload_analyse.test && (
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
              <Typography variant="h3">{payload_analyse.title}</Typography>
              <RichText data={payload_analyse.summary} enableGutter={true} />
            </Box>
            {payload_analyse.data?.name ?
              <ChartContainer
                key={JSON.stringify(payload_analyse.data)} // Providing key to update state when new files are uploaded in preview
                analyse={payload_analyse.data} lang={lang} dict={dict}
              />
              : <Alert severity="error">JSON-fil mangler</Alert>}

            <RichText data={payload_analyse.discussion} enableGutter={true} />

            <Stack spacing={2} sx={{ marginTop: 2, marginBottom: 4 }}>
              {payload_analyse.tags &&
                <TagList
                  tags={payload_analyse.tags.filter((tag) => typeof tag === 'object' && tag !== null)}
                  lang={lang}
                />}
              <Typography variant="body2">
                {dict.analysebox.updated}{" "}
                {makeDateElem(payload_analyse.createdAt, lang)}
              </Typography>
            </Stack>

            <Box
              sx={{
                background: "#343434",
                padding: 2,
                borderRadius: "8px",
                color: "#D7D7D7",
              }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                {dict.analysebox.info}
              </Typography>
              <RichText data={payload_analyse.about} enableGutter={true} />
            </Box>
          </Suspense>
        </Container>
      </main>
    </>
  );
}


const queryAnalyseBySlug = cache(async ({ slug, lang }: { slug: string, lang: Lang }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'analyser',
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
  })

  return result.docs?.[0] || null
})
