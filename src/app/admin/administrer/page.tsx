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
import { getAnalyser, getUnpublishedAnalyser } from "@/services/mongo";
import { formatDate } from "@/lib/helpers";
import { Analyse } from "@/types";

const AnalyseList = function ({ analyser }: { analyser: Analyse[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Analyse</TableCell>
            <TableCell align="right">tags</TableCell>
            <TableCell align="right">sist oppdatert</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analyser.map((analyse) => (
            <TableRow
              key={analyse.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link href={`/admin/administrer/${analyse.name}`}>
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
  );
};

export default async function AdministrerPage() {
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
      link: `/admin/administrer`,
      text: "Administrer analyser",
    },
  ];

  const publishedAnalyser = await getAnalyser("title.no");
  const unpublishedAnalyser = await getUnpublishedAnalyser("title.no");

  return (
    <>
      <HeaderTop breadcrumbs={breadcrumbs} />
      <Container maxWidth="xl" disableGutters={false} sx={{ padding: 4 }}>
        <Typography variant="h3">Administrer analyser</Typography>
        <Typography variant="body1" sx={{ marginY: 2 }}>
          Denne siden gir en oversikt over hva som ligger i databasen av
          publiserte og upubliserte analyser. Det vil snart være mulig å klikke
          på analyser for å administrere de – for eksempel hvis man vil
          publisere testversjonen av en analyse.
        </Typography>
        <Typography variant="h3">Publiserte analyser</Typography>
        <br />
        <AnalyseList analyser={publishedAnalyser} />
        <br />
        <Typography variant="h3">Upubliserte analyser</Typography>
        <br />
        <AnalyseList analyser={unpublishedAnalyser} />
      </Container>
    </>
  );
}
