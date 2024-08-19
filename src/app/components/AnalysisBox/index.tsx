import { getAnalysisBoxById as getAnalysisBoxById } from "@/app/services/mongo";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
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
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${analysisBox.title}-content`}
        id={`panel-${analysisBox.title}-header`}
      >
        <List dense={true}>
          <ListItem>
            <ListItemText
              primary={analysisBox.title}
              secondary={`Oppdatert: ${analysisBox.createdAt.toLocaleString(lang)}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary={analysisBox.description} />
          </ListItem>
        </List>
      </AccordionSummary>
      <AccordionDetails>
        <AnalysisBoxCharts />
      </AccordionDetails>
    </Accordion>
  );
}
