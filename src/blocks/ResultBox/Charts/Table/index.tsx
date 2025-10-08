"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Markdown } from "../../Charts/Markdown";
import { nationalLabel } from "../../helpers";
import { DataItemPoint } from "../../types";
import { customFormat } from "../../helpers";
import { useSelection } from "@/lib/SelectionContext";

export function getOrderComparator<
  D extends { [n: string]: string | number },
  K extends string & keyof D,
>(order: "asc" | "desc", orderBy: K, varType: D[K]) {
  return order === "desc"
    ? (a: D, b: D) => sortDesc<D, K>(a, b, orderBy, varType)
    : (a: D, b: D) => -sortDesc<D, K>(a, b, orderBy, varType);
}

function sortDesc<
  Data extends { [n: string]: string | number },
  K extends string & keyof Data,
>(a: Data, b: Data, orderBy: K, varType: Data[K]) {
  if (varType === "number") {
    if (parseFloat(b[orderBy].toString()) < parseFloat(a[orderBy].toString())) {
      return -1;
    }
    if (parseFloat(b[orderBy].toString()) > parseFloat(a[orderBy].toString())) {
      return 1;
    }
    return 0;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


type DataTableProps = {
  caption: string;
  data: DataItemPoint[];
  headers: {
    id: string;
    label_no: string;
    label_en: string;
    typeVar: "number" | "string";
    format?: string;
  }[];
  lang: "en" | "nb" | "nn";
  areaType: string;
  national: string;
};

export const DataTable = ({
  caption,
  data,
  headers,
  lang,
  areaType,
  national,
}: DataTableProps) => {
  const { selection, toggleSelection } = useSelection(areaType, national);

  const [order, setOrder] = React.useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = React.useState(headers[1].id);
  const createSortHandler = (property) => () => {
    (() => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    })();
  };
  return (
    <TableContainer>
      <Table>
        <caption>
          <Markdown lang={lang}>{caption}</Markdown>
        </caption>
        <TableHead>
          <TableRow>
            {headers.map((header, i) => (
              <TableCell
                key={`${header.id}${i}`}
                align={header.typeVar === "number" ? "right" : "left"}
                padding={"none"}
                sx={{ fontSize: "0.865rem" }}
                sortDirection={orderBy === header.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === header.id}
                  direction={orderBy === header.id ? order : "asc"}
                  onClick={createSortHandler(header.id)}
                  sx={{ fontWeight: 600 }}
                  data-testid={`tablehead_${header.id}`}
                >
                  {lang === "en" ? header.label_en : header.label_no}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...data]
            .sort(
              getOrderComparator(
                order,
                orderBy,
                headers.find((header) => header.id === orderBy).typeVar,
              ),
            )
            .map((row, i) => (
              <TableRow
                hover
                key={`${row.area}${i}`}
                selected={selection.has(String(row.area))}
                data-testid={`tablerow_${row.area}`}
                style={{
                  cursor: row.area != national ? "pointer" : "auto",
                }}
                onClick={() => toggleSelection(String(row.area))}
              >
                {headers.map((cell, ind) => (
                  <TableCell
                    key={`${row.area}${i}${ind}`}
                    component={ind === 0 ? "th" : "td"}
                    scope="row"
                    padding="none"
                    align={cell.typeVar === "number" ? "right" : "left"}
                    sx={{
                      paddingTop: "0.125rem",
                      paddingLeft: cell.typeVar === "number" ? ".5em" : 0,
                      fontFamily:
                        cell.typeVar === "number" ? "Monospace" : "default",
                      fontWeight: row.area === national ? "bolder" : "normal",
                    }}
                  >
                    {cell.format
                      ? customFormat(cell.format, lang)(Number(row[cell.id]))
                      : row[cell.id] === national
                        ? nationalLabel[lang]
                        : row[cell.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
