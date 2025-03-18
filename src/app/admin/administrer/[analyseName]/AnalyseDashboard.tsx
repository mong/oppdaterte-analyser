"use client";

import { makeDateElem } from "@/lib/helpers";
import { Analyse } from "@/types";
import {
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  changePublishedVersionAction,
  publishTestVersion,
} from "@/lib/actions";
import React, { useActionState } from "react";

type AnalyseDashboardProps = {
  analyser: Analyse[];
  analyseName: string;
};

export default function AnalyseDashboard({
  analyser,
  analyseName,
}: AnalyseDashboardProps) {
  const [publishedVersionActionState, publishedAction, pendingPublished] =
    useActionState(changePublishedVersionAction, {
      analyseName,
      version: analyser.find((analyse) => analyse.published)?.version || 0,
    });

  const [publishedVersion, setPublishedVersion] = React.useState(
    publishedVersionActionState.version,
  );
  const isPublished = (analyse: Analyse) =>
    analyse.version > 0 &&
    analyse.version === publishedVersionActionState.version;

  return (
    <>
      <Typography variant="h3">Endre på analysen {analyseName}</Typography>
      <Typography variant="body1" sx={{ marginY: 2 }}>
        På denne siden kan du endre på publiseringsstatusen til analysen.
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
              <TableCell align="right">Dato</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analyser.map((analyse, i) => (
              <TableRow
                key={i}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  background: isPublished(analyse)
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
                  ) : isPublished(analyse) ? (
                    <b>Publisert</b>
                  ) : (
                    "Ubrukt"
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/no/analyse/${analyse.name}/${!isPublished(analyse) ? `test/${analyse.version > 0 ? analyse.version + "/" : ""}` : ""}`}
                  >
                    {analyse.title["no"]}
                  </Link>
                </TableCell>
                <TableCell align="right">{analyse.tags.join(", ")}</TableCell>
                <TableCell align="right">
                  {makeDateElem(analyse.createdAt, "no")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Typography variant="h4">
        Velg hvilken versjon som skal være publisert
      </Typography>
      <br />
      <Typography>
        Her kan du velge hvilken versjon av analysen som skal vises på
        nettsiden. Hvis du velger &quot;ingen&quot;, så vil analysen bli
        avpublisert.
      </Typography>
      <br />
      <form action={publishedAction} id="publishedForm">
        <FormControl disabled={pendingPublished}>
          <InputLabel id="publisert-versjon-label">
            Publisert versjon
          </InputLabel>
          <Select
            sx={{ width: 200 }}
            inputProps={{ form: "publishedForm" }}
            labelId="publisert-versjon-label"
            id="publisert-versjon-select"
            name="publishedVersion"
            value={publishedVersion}
            label="Publisert versjon"
            onChange={(event) =>
              setPublishedVersion(Number(event.target.value))
            }
          >
            <MenuItem value={0}>Ingen</MenuItem>
            {analyser
              .filter((analyse) => analyse.version !== 0)
              .map((analyse, i) => (
                <MenuItem key={i} value={analyse.version}>
                  {analyse.version}
                </MenuItem>
              ))}
          </Select>
          <Button
            disabled={publishedVersion === publishedVersionActionState.version}
            sx={{ marginTop: 2 }}
            variant="contained"
            type="submit"
          >
            Endre versjon
          </Button>
        </FormControl>
      </form>
      <br />
      <Typography variant="h4">Publiser test-versjon</Typography>
      <br />
      <Typography>
        Hvis du skal publisere en test-versjon som du har lastet opp, kan du
        gjøre det her. Tidligere versjoner av analysen vil ikke bli slettet, de
        vil bare bli sjult.
      </Typography>
      <Button
        disabled={!analyser.find((analyse) => analyse.version === 0)}
        sx={{ marginTop: 2 }}
        variant="contained"
        onClick={async (event) => {
          const promptName = prompt(
            "Er du sikker på at du vil publisere analysen? Skriv inn navnet på analysen for å bekrefte publiseringen",
          );
          if (promptName === analyseName) {
            if (await publishTestVersion(analyseName))
              // Test version successfully published
              window.location.reload();
          }
        }}
      >
        Publiser
      </Button>
    </>
  );
}
