"use client";

import DownloadIcon from "@mui/icons-material/Download";
import downloadJSON from "@/lib/downloadJSON";
import { Analyser } from "@/payload-types";

import { Button } from "@mong/material-ui";

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
      startIcon={<DownloadIcon />}
      onClick={() => downloadJSON(analyse)}
      variant="filled"
    >
      {dict.analysebox.download_data}
    </Button>

  );
}
