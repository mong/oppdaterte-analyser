"use client";

import { uploadAnalyseAction } from "@/lib/actions";
import { Alert, Button, Link, styled } from "@mui/material";
import React, { useActionState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadForm() {
  const [state, formAction, pending] = useActionState(uploadAnalyseAction, {
    success: true,
    message: "",
    name: "",
  });

  return (
    <>
      <form action={formAction}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          loading={pending}
          startIcon={<CloudUploadIcon />}
        >
          Last opp
          <VisuallyHiddenInput
            type="file"
            name="analyse"
            id="analyseFile"
            accept="application/json"
            required
            onChange={(event) => event.target.form?.requestSubmit()}
            multiple
          />
        </Button>
      </form>

      <br />
      {state.message &&
        (state.success ? (
          <Alert severity="success">
            {state.message}. Analysen er tilgjengelig{" "}
            <Link href={`/no/analyse/${state.name}/test`}>her</Link>.
          </Alert>
        ) : (
          <Alert severity="error">{state.message}.</Alert>
        ))}
    </>
  );
}
