import mongoose from "mongoose";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";
import { getAnalysisById } from "@/app/services/mongo";
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
    <Accordion sx={{ margin: 4 }} elevation={3} square={false}>
      <AccordionSummary
        expandIcon={<AddCircleOutlineIcon />}
        aria-controls={`panel-${analysis.name}-content`}
        id={`panel-${analysis.name}-header`}
      >
        <List dense={true}>
          <ListItem>
            <ListItemText
              primary={analysis.title.get(lang)}
              secondary={`Publisert: ${analysis.createdAt.toLocaleString(lang)}`}
              primaryTypographyProps={{ variant: "h4" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={analysis.description.get(lang)}
              primaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>
          {analysis.highlights
            .get(lang)
            .map((highlight: string, index: number) => {
              return (
                <ListItem key={`${analysis.name}-${index}`}>
                  <ListItemIcon>
                    <LightbulbCircleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={highlight}
                    primaryTypographyProps={{ variant: "body1" }}
                  />
                </ListItem>
              );
            })}
        </List>
      </AccordionSummary>
      <AccordionDetails>
        <AnalysisBoxCharts analysis={analysisPojo} lang={lang} />
      </AccordionDetails>
    </Accordion>
  );
}
