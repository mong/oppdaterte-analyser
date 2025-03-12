import { Container, Typography } from "@mui/material";
import Header from "@/components/Header";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Lang } from "@/types";
import { getDictionary } from "@/lib/dictionaries";
import { getAnalyser, getKompendier } from "@/services/mongo";
import { notFound } from "next/navigation";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import UnderDevelopment from "@/components/UnderDevelopment";
import { markdownToHtml, stripMarkdown } from "@/lib/getMarkdown";

export const dynamicParams = false;
export async function generateStaticParams() {
  return [{ lang: "no" }, { lang: "en" }];
}

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  return {
    title: dict.frontpage.title,
    description: await stripMarkdown(dict.frontpage.introduction_1),
    keywords: dict.general.metadata_keywords,
  };
}

export type MainPageProps = {
  params: Promise<{
    lang: Lang;
  }>;
};

export default async function MainPage(props: MainPageProps) {
  const params = await props.params;
  const { lang } = params;

  if (!["en", "no"].includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const kompendier = await getKompendier(`fullname.${lang}`);
  const analyser = await getAnalyser(`title.${lang}`);

  const breadcrumbs: BreadCrumbStop[] = [
    {
      link: "https://www.skde.no",
      text: dict.breadcrumbs.homepage,
    },
    {
      link: "https://www.skde.no/helseatlas/",
      text: dict.breadcrumbs.health_atlas,
    },
    {
      link: `/${lang}/`,
      text: dict.breadcrumbs.updated_health_atlas,
    },
  ];

  return (
    <>
      <Header
        lang={lang}
        title={dict.general.updated_health_atlas}
        breadcrumbs={breadcrumbs}
      >
        <Typography
          variant="h6"
          sx={{
            "& > p": { margin: 0, marginY: 2 },
            "& a": { color: "primary.main" },
          }}
          dangerouslySetInnerHTML={{
            __html: await markdownToHtml(dict.frontpage.introduction_1),
          }}
        />
        <Typography
          variant="body1"
          component="div"
          sx={{
            "& > p": { margin: 0 },
            "& a": { color: "primary.main" },
          }}
          dangerouslySetInnerHTML={{
            __html: await markdownToHtml(dict.frontpage.introduction_2),
          }}
        />
      </Header>
      <main>
        <UnderDevelopment lang={lang} />
        <Container maxWidth="xl" disableGutters={false} sx={{ padding: 4 }}>
          <Typography variant="h3">{dict.frontpage.fagområder}</Typography>
          <br />
          <Typography>{dict.frontpage.fagområder_text}</Typography>
          <List dense>
            {kompendier.map((komp, i) => (
              <ListItemButton
                key={i}
                LinkComponent={"a"}
                href={`/${lang}/${komp.name}`}
              >
                <ListItemIcon>•</ListItemIcon>
                <ListItemText
                  primary={`${komp.fullname[lang]} (${analyser.filter((analyse) => analyse.tags.includes(komp.name)).length})`}
                />
              </ListItemButton>
            ))}
          </List>
          <br />
          <Typography variant="h3">{dict.frontpage.all_analyses}</Typography>
          <br />
          <Typography>
            {dict.frontpage.all_analyses_text.replace(
              "<n>",
              analyser.length.toString(),
            )}
          </Typography>
          <List dense>
            {analyser.map((analyse, i) => (
              <ListItemButton
                key={i}
                LinkComponent={"a"}
                href={`/${lang}/analyse/${analyse.name}`}
              >
                <ListItemIcon>•</ListItemIcon>
                <ListItemText primary={analyse.title[lang]} />
              </ListItemButton>
            ))}
          </List>
        </Container>
      </main>
    </>
  );
}
