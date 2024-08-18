import { getAnalysisBoxById as getAnalysisBoxById } from "@/app/services/mongo";
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
import AnalysisBoxCharts from "@/app/components/AnalysisBoxCharts";

type AnalysisBoxProps = {
  boxId: mongoose.Types.ObjectId;
  lang: string;
};

export default async function AnalysisBox({ boxId, lang }: AnalysisBoxProps) {
  const analysisBox = await getAnalysisBoxById(boxId);
  return (
    <Paper>
      <Grid container>
        <Grid sm={12}>
          <Typography variant="h6">{analysisBox.title}</Typography>
          <Typography variant="caption">
            Opprettet: {analysisBox.createdAt.toLocaleString(lang)}, Oppdatert:
            {analysisBox.createdAt.toLocaleString(lang)}
          </Typography>
          <Typography variant="body1">{analysisBox.description}</Typography>
        </Grid>
        <Grid sm={12}>
          <AnalysisBoxCharts />
        </Grid>
        <Grid sm={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${analysisBox.title}-content`}
              id={`panel-${analysisBox.title}-header`}
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
