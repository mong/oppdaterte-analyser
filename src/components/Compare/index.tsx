import { Analyse } from "@/types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";
import { formatDate } from "@/lib/helpers";

type CompareProps = {
  oldAnalyse: Analyse;
  newAnalyse: Analyse;
};

export const Compare = ({ oldAnalyse, newAnalyse }: CompareProps) => {
  const makeReport = (
    title: string,
    checkFunction: () => React.JSX.Element[],
  ) => {
    const results = checkFunction();

    return (
      <Box>
        <Typography variant="h4" sx={{ marginTop: 1 }}>
          {title}{" "}
          {results.length === 0 ? (
            <CheckIcon color="success" />
          ) : (
            <WarningIcon color="warning" />
          )}{" "}
        </Typography>
        {results.length > 0 && (
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        )}
      </Box>
    );
  };

  const oldTags = new Set(oldAnalyse.tags);
  const newTags = new Set(newAnalyse.tags);
  const oldTagsDiff = oldTags.difference(newTags);
  const newTagsDiff = newTags.difference(oldTags);

  const tagReport = makeReport("Tags", () =>
    oldTagsDiff.size + newTagsDiff.size === 0
      ? []
      : [
          ...(oldTagsDiff.size > 0
            ? [
                <span>
                  Disse taggene finnes bare i den gamle versjonen:{" "}
                  {Array.from(oldTagsDiff).join(", ")}
                </span>,
              ]
            : []),
          ...(newTagsDiff.size > 0
            ? [
                <span>
                  Disse taggene finnes bare i den nye versjonen:{" "}
                  {Array.from(newTagsDiff).join(", ")}
                </span>,
              ]
            : []),
        ],
  );

  const oldViews = new Set(oldAnalyse.views.map((view) => view.name));
  const newViews = new Set(newAnalyse.views.map((view) => view.name));
  const oldViewsDiff = oldViews.difference(newViews);
  const newViewsDiff = newViews.difference(oldViews);

  const viewReport = makeReport("Visninger", () =>
    oldViewsDiff.size + newViewsDiff.size === 0
      ? []
      : [
          ...(oldViewsDiff.size > 0
            ? [
                <span>
                  Disse visningene finnes bare i den gamle versjonen:{" "}
                  {Array.from(oldViewsDiff).join(", ")}
                </span>,
              ]
            : []),
          ...(newViewsDiff.size > 0
            ? [
                <span>
                  Disse visningene finnes bare i den nye versjonen:{" "}
                  {Array.from(newViewsDiff).join(", ")}
                </span>,
              ]
            : []),
        ],
  );

  const newYears = [
    Math.min(...Object.keys(newAnalyse.data.sykehus[1]).map(Number)),
    Math.max(...Object.keys(newAnalyse.data.sykehus[1]).map(Number)),
  ];
  const oldYears = [
    Math.min(...Object.keys(oldAnalyse.data.sykehus[1]).map(Number)),
    Math.max(...Object.keys(oldAnalyse.data.sykehus[1]).map(Number)),
  ];

  const yearReport = makeReport("Årstall", () =>
    oldYears.toString() === newYears.toString()
      ? [
          <span>
            Den nye analysen har data for samme tidsperiode som den gamle
            analysen: {oldYears.join("–")}
          </span>,
        ]
      : oldYears[0] !== newYears[0] || oldYears[1] + 1 !== newYears[1]
        ? [
            <span>
              Årstallene inkludert i den nye analysen skiller seg på en uvanlig
              måte fra den gamle.
            </span>,
            <span>Årstall for den gamle analysen: {oldYears.join("–")}.</span>,
            <span>Årstall for den nye analysen: {newYears.join("–")}.</span>,
          ]
        : [],
  );

  const ageReport = makeReport("Aldersspenn", () =>
    oldAnalyse.age_range.toString() !== newAnalyse.age_range.toString()
      ? [
          <span>
            Den nye analysen har aldersgruppe {newAnalyse.age_range.join("–")},
            mens den gamle har {oldAnalyse.age_range.join("–")}.
          </span>,
        ]
      : [],
  );

  const kjonnReport = makeReport("Kjønn", () =>
    oldAnalyse.kjonn !== newAnalyse.kjonn
      ? [
          <span>
            Den nye analysen har kjønn {newAnalyse.kjonn}, mens den gamle har{" "}
            {oldAnalyse.kjonn}.
          </span>,
        ]
      : [],
  );

  const generertRapport = makeReport("Genereringstidspunkt", () =>
    oldAnalyse.generated > newAnalyse.generated
      ? [
          <span>
            Den nye analysen ble generert i SAS før den gamle analysen.
          </span>,
          <span>
            Den gamle versjonen ble generert{" "}
            {formatDate(new Date(oldAnalyse.generated), "no")}.
          </span>,
          <span>
            Den nye versjonen ble generert{" "}
            {formatDate(new Date(newAnalyse.generated), "no")}.
          </span>,
        ]
      : oldAnalyse.generated === newAnalyse.generated
        ? [
            <span>
              Den gamle og den nye versjonen ble generert samtidig (
              {formatDate(new Date(newAnalyse.generated), "no")}).
            </span>,
          ]
        : [],
  );

  return (
    <Accordion color="primary" disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{ color: "primary.main", padding: 2, paddingX: 4 }}
      >
        <Typography variant="h3">Integritetssjekk</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          Sammenligner {newAnalyse.name} (v. {newAnalyse.version || "test"}) med{" "}
          {oldAnalyse.name} (v. {oldAnalyse.version || "test"}).
        </p>
        {tagReport}
        {viewReport}
        {yearReport}
        {ageReport}
        {kjonnReport}
        {generertRapport}
      </AccordionDetails>
    </Accordion>
  );
};
