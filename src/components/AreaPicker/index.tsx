import Grid from "@mui/material/Grid2";
import { hospitalStructure, regions_dict, Selection } from "@/lib/nameMapping";
import { Lang } from "@/types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export type AreaPickerProps = {
  selection: Selection;
  lang: Lang;
  onRegionChange: (region: number) => void;
  onSykehusChange: (sykehus: number) => void;
  dict: { [k: string]: string };
};

export default function AreaPicker({
  selection,
  lang,
  onRegionChange,
  onSykehusChange,
  dict,
}: AreaPickerProps) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="area-picker"
        id="area-picker"
      >
        <Typography>{dict.choose_area}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {[[4], [3, 2, 1]].map((region_grouping, i) => (
            <Grid
              container
              key={i}
              size={
                i === 0
                  ? { xs: 6, sm: 4, md: 4, lg: 3 }
                  : { xs: 6, sm: 8, md: 8, lg: 9 }
              }
              order={
                i === 0 ? { xs: 2, sm: 1, md: 1 } : { xs: 1, sm: 2, md: 2 }
              }
            >
              {region_grouping.map((region, i) => (
                <Grid
                  key={i}
                  size={
                    region === 4 ? { xs: 12 } : { xs: 12, sm: 6, md: 6, lg: 4 }
                  }
                  sx={{ backgroundColor: "" }}
                >
                  <FormControlLabel
                    label={
                      <Typography variant="body2">
                        {regions_dict[lang].region[Number(region)]}
                      </Typography>
                    }
                    control={
                      <Checkbox
                        checked={selection.region.includes(Number(region))}
                        indeterminate={
                          !selection.region.includes(Number(region)) &&
                          selection.sykehus.some((sykehus) =>
                            hospitalStructure[region].includes(sykehus),
                          )
                        }
                        onChange={() => onRegionChange(region)}
                      />
                    }
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: 3,
                    }}
                  >
                    {hospitalStructure[Number(region)].map((hospital, i) => (
                      <FormControlLabel
                        key={i}
                        label={
                          <Typography variant="body2">
                            {regions_dict[lang].sykehus[hospital]}
                          </Typography>
                        }
                        control={
                          <Checkbox
                            checked={selection.sykehus.includes(hospital)}
                            onChange={() => onSykehusChange(hospital)}
                          />
                        }
                      />
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
