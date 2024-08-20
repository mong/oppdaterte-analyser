import { getAnalysisById } from "@/app/services/mongo";
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
  const analysis = await getAnalysisById(boxId);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${analysis.name}-content`}
        id={`panel-${analysis.name}-header`}
      >
        <List dense={true}>
          <ListItem>
            <ListItemText
              primary={analysis.title.get(lang)}
              secondary={`Publisert: ${analysis.createdAt.toLocaleString(lang)}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary={analysis.description.get(lang)} />
          </ListItem>
        </List>
      </AccordionSummary>
      <AccordionDetails>
        <AnalysisBoxCharts analysis={analysis} lang={lang} />
      </AccordionDetails>
    </Accordion>
  );
}
