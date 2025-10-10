import { HeaderTop } from "@/components/Header";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import { loginCredentials } from "@/lib/authorization";
import { getDictionary } from "@/lib/dictionaries";
import { Container } from "@mui/material";
import { redirect } from "next/navigation";
import { getAnalyseVersions } from "@/services/mongo";
import AnalyseDashboard from "./AnalyseDashboard";

export default async function AdministrerAnalysePage(props: {
  params: Promise<{ analyseName: string }>;
}) {
  const credentials = await loginCredentials();
  if (!credentials) {
    redirect("/login");
  }

  const { analyseName } = await props.params;
  const analyser = await getAnalyseVersions(analyseName);

  const dict = await getDictionary("no");
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
      link: "/",
      text: dict.breadcrumbs.updated_health_atlas,
    },
    {
      link: "/admin/administrer",
      text: "Administrer analyser",
    },
    {
      link: `/admin/administrer/${analyseName}`,
      text: analyseName,
    },
  ];

  return (
    <>
      <HeaderTop breadcrumbs={breadcrumbs} />
      <Container maxWidth="xxl" disableGutters={false} sx={{ padding: 4 }}>
        <AnalyseDashboard analyseName={analyseName} analyser={analyser} />
      </Container>
    </>
  );
}
