import { getResultBoxById } from "@/app/services/mongo";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import mongoose from "mongoose";
import ResultBoxBarchart from "@/app/components/ResultBoxBarchart";

type ResultBoxProps = {
  boxId: mongoose.Types.ObjectId;
};

export default async function ResultBox({ boxId }: ResultBoxProps) {
  const box = await getResultBoxById(boxId);
  return (
    <Paper>
      <Grid container>
        <Grid sm={12}>
          <Typography variant="h6">{box.title}</Typography>
          <Typography variant="caption">
            Opprettet: {box.createdAt.toLocaleString("no")}, Oppdatert:{" "}
            {box.createdAt.toLocaleString("no")}
          </Typography>
          <Typography variant="body1">{box.description}</Typography>
        </Grid>
        <Grid sm={12}>
          <ResultBoxBarchart />
        </Grid>
        <Grid sm={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${box.title}-content`}
              id={`panel-${box.title}-header`}
            >
              Mer info
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Paper>
  );
}
