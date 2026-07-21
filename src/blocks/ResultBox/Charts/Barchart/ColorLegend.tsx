import classNames from "../Classes.module.css";

type ColorLegendProps = {
  labels?: string[];
  onClick?: () => void;
  values: string[];
};

export const ColorLegend = ({
  labels,
  values,
}: ColorLegendProps) => {
  return (
    <div className={classNames.legendContainer}>
      <ul className={classNames.legendUL}>
        {values.map((val, i) => (
          <li key={val + i} className={classNames.legendLI}>
            <div
              className={classNames.legendColorOuter}
              style={{
                border: `0.125rem solid var(--bar-${values.length - i})`,
              }}
            >
              <div
                className={`${classNames.legendColorInner}`}
                style={{ backgroundColor: `var(--bar-${values.length - i})` }}
              ></div>
            </div>
            {labels ? labels[i] : val}
          </li>
        ))}
      </ul>
    </div>
  );
};
