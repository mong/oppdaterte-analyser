import { HeaderTop } from "@/components/Header";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import { loginCredentials } from "@/lib/authorization";
import { getDictionary } from "@/lib/dictionaries";
import { Container } from "@mui/material";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HeadersPage() {
  const headerList = await headers();

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
      link: `/admin/headers`,
      text: "HTTP Headers",
    },
  ];

  return (
    <>
      <HeaderTop breadcrumbs={breadcrumbs} />
      <Container maxWidth="xl" disableGutters={false} sx={{ padding: 4 }}>
        <h1>Request Headers</h1>
        <ul>
          {Array.from(headerList.entries()).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>: {value}
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
