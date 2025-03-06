import { HeaderTop } from "@/components/Header";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import { loginCredentials } from "@/lib/authorization";
import { getDictionary } from "@/lib/dictionaries";
import {
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { redirect } from "next/navigation";
import { getAnalyseVersions } from "@/services/mongo";
import { formatDate } from "@/lib/helpers";

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
      link: "https://www.skde.no/helseatlas/",
      text: dict.breadcrumbs.health_atlas,
    },
    {
      link: "/",
      text: dict.breadcrumbs.updated_health_atlas,
    },
    {
      link: "/admin/administrer/",
      text: "Administrer analyser",
    },
    {
      link: `/admin/administrer/${analyseName}/`,
      text: analyseName,
    },
  ];

  return (
    <>
      <HeaderTop breadcrumbs={breadcrumbs} />
      <Container maxWidth="xl" disableGutters={false} sx={{ padding: 4 }}>
        <Typography variant="h3">Endre på analysen {analyseName}</Typography>
        <Typography variant="body1" sx={{ marginY: 2 }}>
          Her skal man kunne gjøre endringer.
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <caption>
              Denne tabellen viser alle versjoner av {analyseName} som finnes i
              databasen
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>Versjon</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tittel</TableCell>
                <TableCell align="right">Tags</TableCell>
                <TableCell align="right">Oppdatert</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyser.map((analyse, i) => (
                <TableRow
                  key={i}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    background: analyse.published
                      ? "rgba(0, 255, 0, 0.2)"
                      : analyse.version === 0
                        ? "lightyellow"
                        : "",
                  }}
                >
                  <TableCell component="th" scope="row">
                    {analyse.version}
                  </TableCell>
                  <TableCell>
                    {analyse.version === 0 ? (
                      "Test"
                    ) : analyse.published === true ? (
                      <b>Publisert</b>
                    ) : (
                      "Ubrukt"
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/no/analyse/${analyse.name}/${analyse.published === false ? `test/${analyse.version > 0 ? analyse.version : ""}` : ""}`}
                    >
                      {analyse.title["no"]}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{analyse.tags.join(", ")}</TableCell>
                  <TableCell align="right">
                    {formatDate(analyse.updatedAt, "no")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
