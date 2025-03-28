import { Analyse, Lang } from "@/types";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { regions_dict } from "./nameMapping";

export default function downloadCsv(analyse: Analyse, lang: Lang): void {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: `${analyse.name}_${lang}`,
  });

  const data = ["sykehus", "region"].flatMap((nivå) =>
    Object.keys(analyse.data[nivå])
      .filter((area) => nivå === "region" || area !== "8888")
      .flatMap((area) =>
        Object.keys(analyse.data[nivå][area]).map((year) => ({
          [{ no: "Opptaksområde", en: "Catchment area" }[lang]]:
            regions_dict[lang][nivå as "sykehus" | "region"][Number(area)],
          [{ no: "År", en: "Year" }[lang]]: year,
          n: analyse.data[nivå][area][year]["total"][1],
          ...Object.fromEntries(
            analyse.views.flatMap((view) =>
              view.variables.map((variable, variable_index) => [
                variable[lang],
                analyse.data[nivå][area][year][view.name][variable_index],
              ]),
            ),
          ),
        })),
      ),
  );

  download(csvConfig)(generateCsv(csvConfig)(data));
}
