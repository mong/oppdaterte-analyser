import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Header from "@/app/components/Header";
import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";

export type MainPageProps = {
  params: {
    lang: "en" | "no";
  };
};

export default async function MainPage({ params }: MainPageProps) {
  const t = await getTranslations("MainPage");

  return (
    <>
      <Header title={t("title")} introduction={t("introduction")} />
      <main>
        <Box className="centered padding">
          <Typography>
            {t("useSlug")}{" "}
            <Link href={`/${params.lang}/barn`}>/{params.lang}/barn</Link>.
          </Typography>
        </Box>
      </main>
    </>
  );
}
