import { AxisBottom } from "@visx/axis";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { max } from "d3-array";
import classNames from "../Barchart/ChartLegend.module.css";
import { abacusColors, nationalLabel } from "../../helpers";
import { DataItemPoint } from "../../types";
import { useSelection } from "@/lib/SelectionContext";

type AbacusProps = {
  data: DataItemPoint[];
  lang: "en" | "nb" | "nn";
  x: string;
  width?: number;
  height?: number;
  margin?: { top: number; bottom: number; right: number; left: number };
  colorLegend?: boolean;
  label?: string;
  xMin?: number;
  xMax?: number;
  areaType: string;
  areaName: string;
  markerOpacity?: number;
  format?: string;
  national: string;
};

export const Abacus = ({
  width = 950,
  height = 100,
  margin = {
    top: 30,
    bottom: 5,
    right: 30,
    left: 30,
  },
  data,
  lang,
  label,
  x,
  xMin = 0,
  xMax,
  areaType,
  areaName,
  national,
}: AbacusProps) => {
  const { selection, toggleSelection } = useSelection(areaType, national);


  // Move Norge and selected area to the end of data to plot,
  // so they will be on top of the other circles.
  const figData = data
    .filter(
      (d) => d["area"] !== national && !selection.has(d["area"] as string),
    )
    .concat(data.find((d) => d["area"] === national)!)
    .concat(data.filter((d) => selection.has(d["area"] as string)));


  const values = [...figData.flatMap((dt) => dt[x] as number)];
  const xMaxVal = xMax ? xMax : max(values)! * 1.1;
  const innerWidth = width - margin.left - margin.right;
  const colors = abacusColors;

  const selectedText = {
    en: "Selected",
    nb: "Valgte",
    nn: "Valde",
  };

  const xScale = scaleLinear<number>({
    domain: [xMin, xMaxVal],
    range: [0, innerWidth],
  });
  return (
    <>
      <svg
        width="100%"
        height={height}
        style={{ display: "block", margin: "auto" }}
        viewBox={`0 0 ${width} ${height + margin.top}`}
      >
        <Group left={margin.left} top={margin.top}>
          <AxisBottom
            top={0}
            scale={xScale}
            strokeWidth={2}
            stroke={"black"}
            numTicks={4}
            tickFormat={(val) =>
              val.toString()
            }
            tickLength={20}
            tickStroke={"black"}
            tickTransform={`translate(0,-${20 / 2})`}
            tickLabelProps={() => ({
              fontSize: 22,
              fill: "black",
              textAnchor: "middle",
              y: 50,
            })}
            label={label}
            labelProps={{
              fontSize: 22,
              textAnchor: "middle",
              fontWeight: "bold",
            }}
          />
        </Group>
        <Group left={margin.left} top={margin.top}>
          {figData.map((d, i) => (
            <circle
              key={`${d[x]}${i}`}
              r={20}
              cx={xScale(d[x] as number)}
              fill={
                selection.has(d["area"] as string)
                  ? colors[2]
                  : d["area"] === national
                    ? colors[1]
                    : colors[0]
              }
              onClick={(event) => {
                // Add HF to query param if clicked on.
                // Remove HF from query param if it already is selected.
                // Only possible to click on HF, and not on national data
                toggleSelection(d["area"] as string);
                event.stopPropagation();
              }}
            />
          ))}
        </Group>
      </svg>
      <div className={classNames.legendContainer}>
        <ul className={classNames.legendUL}>
          <li key={"hf"} className={classNames.legendLI}>
            <div className={classNames.legendAnnualVar}>
              <svg width="20px" height="20px">
                <circle r={7} cx={10} cy={10} fill={colors[0]} />
              </svg>
            </div>
            {areaName}
          </li>
          <li key={"national"} className={classNames.legendLI}>
            <div className={classNames.legendAnnualVar}>
              <svg width="20px" height="20px">
                <circle r={7} cx={10} cy={10} fill={colors[1]} />
              </svg>
            </div>
            {nationalLabel[lang]}
          </li>
          {selection.size > 0 && (
            <li key={"selected_area"} className={classNames.legendLI}>
              <>
                <div className={classNames.legendAnnualVar}>
                  <svg width="20px" height="20px">
                    <circle r={7} cx={10} cy={10} fill={colors[2]} />
                  </svg>
                </div>
                {selection.size === 1
                  ? Array.from(selection)[0]
                  : `${selectedText[lang]} ${areaName.toLowerCase()}`}
              </>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};
