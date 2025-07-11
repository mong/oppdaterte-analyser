import { HeaderTop } from "@/components/Header";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import { loginCredentials } from "@/lib/authorization";
import { getDictionary } from "@/lib/dictionaries";
import {
  Container,
  IconButton,
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
import {
  getAnalyse,
  getAnalyser,
  getUnpublishedAnalyser,
} from "@/services/mongo";
import { makeDateElem } from "@/lib/helpers";
import { Analyse } from "@/types";
import SettingsIcon from "@mui/icons-material/Settings";
import ScienceIcon from "@mui/icons-material/Science";

const AnalyseList = function ({ analyser }: { analyser: Analyse[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Analyse</TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Tags</TableCell>
            <TableCell align="right">Oppdatert</TableCell>
            <TableCell align="right">Test</TableCell>
            <TableCell align="right">Endre</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analyser.map(async (analyse) => (
            <TableRow
              key={analyse.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link
                  href={`/no/analyse/${analyse.name}/${analyse.published ? "" : `test/${analyse.version > 0 ? analyse.version : ""}`}`}
                >
                  {analyse.title["no"]}
                </Link>
              </TableCell>
              <TableCell align="right">{analyse.name}</TableCell>
              <TableCell align="right">{analyse.tags.join(", ")}</TableCell>
              <TableCell align="right">
                {makeDateElem(analyse.createdAt, "no")}
              </TableCell>
              <TableCell align="right">
                {(await getAnalyse(analyse.name, 0)) && (
                  <ScienceIcon sx={{ color: "darkgreen" }} />
                )}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="endre analyse"
                  href={`/admin/administrer/${analyse.name}/`}
                >
                  <SettingsIcon />
                </IconButton>
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
      link: "/",
      text: dict.breadcrumbs.updated_health_atlas,
    },
    {
      link: "/admin/administrer/",
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
          publiserte og upubliserte analyser. Det er også mulig å publisere
          eller avpublisere analyser, eller velge hvilken versjon av en analyse
          som skal være publisert.
        </Typography>
        <Typography variant="h4">Upubliserte analyser</Typography>
        <br />
        <AnalyseList analyser={unpublishedAnalyser} />
        <br />
        <Typography variant="h4">Publiserte analyser</Typography>
        <br />
        <AnalyseList analyser={publishedAnalyser} />
      </Container>
    </>
  );
}
