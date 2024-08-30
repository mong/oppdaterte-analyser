"use client";

import React from "react";
import classNames from "./AnalyseBox.module.css";
import {
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { Analyse } from "@/models/AnalyseModel";
import { AnalyseBarChart } from "./AnalyseBarChart";
import { AnalyseLineChart } from "./AnalyseLineChart";
import { Tag } from "@/models/TagModel";

export type AnalyseBoxProps = {
  analyse: Analyse;
  tags: { [k: string]: Tag };
  lang: string;
};

export default function AnalyseBox({ analyse, tags, lang }: AnalyseBoxProps) {
  const years = Object.keys(analyse.data.region["1"]).map(Number);
  years.sort((a, b) => b - a);

  const [year, setYear] = React.useState(Math.max(...years));
  const [level, setLevel] = React.useState<"region" | "sykehus">("sykehus");
  const [visning, setVisning] = React.useState<"barchart" | "tidstrend">(
    "barchart",
  );
  const [view, setView] = React.useState(analyse.views[0]);
  const [expanded, setExpanded] = React.useState(false);

  const theme = useTheme();

  const tagList = (
    <Box className={classNames["tag-container"]}>
      {analyse.tags.map((tag) => (
        <Chip
          label={tags[tag].fullname[lang]}
          color="primary"
          key={tag}
          sx={{ marginRight: "1em" }}
        />
      ))}
    </Box>
  );

  return (
    <Accordion
      disableGutters
      className={classNames["analyse-box"]}
      square={true}
      expanded={expanded}
      sx={{
        overflow: "clip",
      }}
    >
      <AccordionSummary
        aria-controls={`${analyse.name}-content`}
        id={`${analyse.name}-header`}
        sx={{
          transition: "background-color .2s ease-in",
          background: `linear-gradient(rgba(0, 0, 0, 0), white)`,
          ":hover": {
            backgroundColor: theme.palette.surface2.light,
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ padding: "10px" }}>
          <Typography variant="h3">{analyse.title[lang]}</Typography>
          <Typography variant="body2">
            Oppdatert: {new Date(analyse.published).toUTCString()}
          </Typography>
          <ul>
            <li>
              <Typography>{analyse.description[lang]}</Typography>
            </li>
            <li>
              <Typography>Dette er en konklusjon, dataene viser at.</Typography>
            </li>
            <li>
              <Typography>
                En normativ oppfordring til å gjøre mer eller mindre av et eller
                annet?
              </Typography>
            </li>
          </ul>

          {!expanded && tagList}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid
            xs={12}
            sm={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth>
              <InputLabel id="select-level-label">Geografisk område</InputLabel>
              <Select
                labelId="select-level-label"
                id="select-level"
                value={level}
                label="Geografisk område"
                onChange={(e) =>
                  setLevel(e.target.value as "sykehus" | "region")
                }
              >
                <MenuItem value={"region"}>Region</MenuItem>
                <MenuItem value={"sykehus"}>Sykehus</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid
            xs={12}
            sm={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth>
              <InputLabel id="select-visning-label">Visning</InputLabel>
              <Select
                labelId="select-visning-label"
                id="select-visning"
                value={visning}
                label="Visning"
                onChange={(e) =>
                  setVisning(e.target.value as "barchart" | "tidstrend")
                }
              >
                <MenuItem value={"barchart"}>Enkeltår</MenuItem>
                <MenuItem value={"tidstrend"}>Tidstrend</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            xs={12}
            sm={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth disabled={visning === "tidstrend"}>
              <InputLabel id="select-year-label">Velg år</InputLabel>
              <Select
                labelId="select-year-label"
                id="select-year"
                value={visning === "tidstrend" ? "-" : year.toString()}
                label="Velg år"
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <MenuItem key={y.toString()} value={y}>
                    {y}
                  </MenuItem>
                ))}
                {visning === "tidstrend" && (
                  <MenuItem value={"-"}>Alle år vises</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Paper elevation={0} className={classNames["chart-container"]}>
          {visning === "barchart" ? (
            <AnalyseBarChart
              analyse={analyse}
              year={year}
              level={level}
              view={view}
            />
          ) : (
            <AnalyseLineChart
              analyse={analyse}
              years={years}
              level={level}
              view={view}
            />
          )}
        </Paper>
        <br />
        <Typography>
          {" "}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet
          ultricies enim. Nulla suscipit sit amet velit vitae pulvinar. In
          feugiat sodales lacus. Mauris porttitor accumsan eros, nec porttitor
          tellus. Quisque non justo fermentum, efficitur erat sit amet, gravida
          ligula. Suspendisse consequat dictum condimentum. Vestibulum ante
          ipsum primis in faucibus orci luctus et ultrices posuere cubilia
          curae; Praesent quis eleifend nisi. Proin at interdum ligula, et
          venenatis libero. Ut semper condimentum urna, vel tincidunt orci
          aliquam vitae.{" "}
        </Typography>
        <br />
        <Typography>
          {" "}
          Integer ornare odio odio, vitae efficitur purus dignissim eget. Aenean
          elementum neque sed ultrices hendrerit. In quam justo, bibendum sed
          metus non, vestibulum vestibulum odio. Maecenas ultricies bibendum
          vehicula. Pellentesque vitae orci vehicula dolor pulvinar sodales.
          Nunc rhoncus ultricies mi eu faucibus. Duis elit neque, sodales quis
          imperdiet eget, lacinia ut turpis. Praesent iaculis ante mi, id
          pellentesque dolor mollis at. Morbi placerat tristique odio ac
          convallis. Donec a ullamcorper nisi. Cras libero tellus, sodales id
          tellus sit amet, cursus imperdiet nibh.{" "}
        </Typography>
        {tagList}
      </AccordionDetails>
    </Accordion>
  );
}
