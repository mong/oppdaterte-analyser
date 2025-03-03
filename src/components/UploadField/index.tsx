"use client";

import { uploadAnalyseAction } from "@/lib/uploadAnalyseAction";
import { Alert, Link } from "@mui/material";
import React, { useActionState } from "react";

export default function UploadField() {
  const [state, formAction, _] = useActionState(uploadAnalyseAction, {
    success: true,
    message: "",
    name: "",
  });

  return (
    <>
      <form action={formAction}>
        <div>
          <input
            type="file"
            name="analyse"
            id="analyseFile"
            accept="application/json"
            required
          />
        </div>
        <div>
          <input type="submit" value="Last opp!" />
        </div>
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
