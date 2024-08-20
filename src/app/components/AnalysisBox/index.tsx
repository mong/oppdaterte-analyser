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
import { Analysis } from "@/app/models/AnalysisModel";
import { toPlainObject } from "@/app/lib/mappings";

type AnalysisBoxProps = {
  boxId: mongoose.Types.ObjectId;
  lang: string;
};

export default async function AnalysisBox({ boxId, lang }: AnalysisBoxProps) {
  const analysis = await getAnalysisById(boxId);
  const analysisPojo = toPlainObject<Analysis>(analysis);

  return (
    <Accordion sx={{ margin: 2 }}>
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
        <AnalysisBoxCharts analysis={analysisPojo} lang={lang} />
      </AccordionDetails>
    </Accordion>
  );
}
