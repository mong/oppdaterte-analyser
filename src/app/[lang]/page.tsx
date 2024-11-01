import Typography from "@mui/material/Typography";
import Header from "@/components/Header";
import {
  Box,
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

  return (
    <>
      <Header
        lang={params.lang}
        title={dict.general.updated_analyses}
        introduction={dict.frontpage.introduction}
      />
      <main>
        <Box className="centered padding">
          <Paper sx={{ padding: 2, maxWidth: "1000px" }}>
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
        </Box>
      </main>
    </>
  );
}
