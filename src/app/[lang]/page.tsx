import Typography from "@mui/material/Typography";
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
import CenteredContainer from "@/components/CenteredContainer";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";

export const generateMetadata = async ({
  params,
}: {
  params: { lang: Lang };
}) => {
  const dict = await getDictionary(params.lang);
  return {
    title: dict.frontpage.title,
    description: dict.frontpage.description,
  };
};

export type MainPageProps = {
  params: {
    lang: Lang;
  };
};

export default async function MainPage({ params }: MainPageProps) {
  if (!["en", "no"].includes(params.lang)) {
    notFound();
  }

  const dict = await getDictionary(params.lang);
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
      link: "https://www.skde.no/helseatlas/",
      text: dict.breadcrumbs.updated_analyses,
    },
  ];

  return (
    <>
      <Header
        lang={params.lang}
        title={dict.general.updated_analyses}
        introduction={dict.frontpage.introduction}
        breadcrumbs={breadcrumbs}
      />
      <main>
        <CenteredContainer>
          <Paper sx={{ padding: 2 }}>
            <Typography>{dict.frontpage.list_text}</Typography>
            <List>
              {kompendier.map((komp, i) => (
                <ListItemButton
                  key={i}
                  LinkComponent={"a"}
                  href={`/${params.lang}/${komp.name}`}
                >
                  <ListItemIcon>
                    <ArrowForwardRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={komp.fullname[params.lang]} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </CenteredContainer>
      </main>
    </>
  );
}
