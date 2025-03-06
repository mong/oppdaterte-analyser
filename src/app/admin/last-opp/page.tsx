import { HeaderTop } from "@/components/Header";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import UploadForm from "@/components/Forms/UploadForm";
import { loginCredentials } from "@/lib/authorization";
import { getDictionary } from "@/lib/dictionaries";
import { Container, Typography } from "@mui/material";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const credentials = await loginCredentials();
  if (!credentials) {
    redirect("/login");
  }

  const dict = await getDictionary("no");
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
      link: `/`,
      text: dict.breadcrumbs.updated_health_atlas,
    },
    {
      link: `/admin/upload`,
      text: "Last opp analyse",
    },
  ];

  return (
    <>
      <HeaderTop breadcrumbs={breadcrumbs} />
      <Container maxWidth="xl" disableGutters={false} sx={{ padding: 4 }}>
        <Typography variant="h3">Last opp analyse</Typography>
        <Typography variant="body1" sx={{ marginY: 2 }}>
          Analysen er en .json fil som blir generert av makroen{" "}
          <code>%publiser</code> på SAS-siden. Analysen vil ikke bli publisert,
          men den vil bli tilgjengelig som en test-versjon (med versjonsnummer
          0). Hvis det finnes en test-versjon fra før av vil den bli
          overskrevet.
        </Typography>
        <UploadForm />
      </Container>
    </>
  );
}
