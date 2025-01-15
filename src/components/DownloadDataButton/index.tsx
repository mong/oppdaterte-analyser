"use client";

import { Analyse, Lang } from "@/types";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import downloadCsv from "@/lib/downloadCsv";

type DownloadDataButtonProps = {
  analyse: Analyse;
  lang: Lang;
  dict: { [k: string]: { [k: string]: string } };
};

export default function DownloadDataButton({
  analyse,
  lang,
  dict,
}: DownloadDataButtonProps) {
  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={() => downloadCsv(analyse, lang)}
    >
      {dict.analysebox.download_data}
    </Button>
  );
}
