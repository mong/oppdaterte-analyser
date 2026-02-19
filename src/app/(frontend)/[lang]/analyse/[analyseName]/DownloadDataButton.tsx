"use client";

import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import downloadJSON from "@/lib/downloadJSON";
import { Analyser } from "@/payload-types";

type DownloadDataButtonProps = {
  analyse: Analyser["data"];
  dict: { [k: string]: { [k: string]: string } };
};

export default function DownloadDataButton({
  analyse,
  dict,
}: DownloadDataButtonProps) {
  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={() => downloadJSON(analyse)}
    >
      {dict.analysebox.download_data}
    </Button>
  );
}
