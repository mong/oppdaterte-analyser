import { Container, Typography } from "@mui/material";
import Header from "@/components/Header";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { Lang } from "@/types";
import { getDictionary } from "@/lib/dictionaries";
import { getKompendier } from "@/services/mongo";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { notFound } from "next/navigation";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import UnderDevelopment from "@/components/UnderDevelopment";

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  return {
    title: dict.frontpage.title,
    description: dict.frontpage.description,
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
  const kompendier = await getKompendier();

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
      text: dict.breadcrumbs.updated_analyses,
    },
  ];

  return (
    <>
      <Header
        lang={lang}
        title={dict.general.updated_analyses}
        introduction={dict.frontpage.introduction}
        breadcrumbs={breadcrumbs}
      />
      <main>
        <UnderDevelopment lang={lang} />
        <Container maxWidth="xl" disableGutters={false} sx={{ padding: 4 }}>
          <Paper sx={{ padding: 2 }}>
            <Typography>{dict.frontpage.list_text}</Typography>
            <List>
              {kompendier.map((komp, i) => (
                <ListItemButton
                  key={i}
                  LinkComponent={"a"}
                  href={`/${lang}/${komp.name}`}
                >
                  <ListItemIcon>
                    <ArrowForwardRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={komp.fullname[lang]} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Container>
      </main>
    </>
  );
}
