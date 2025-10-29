"use client";
import React from "react";
import { JSONField, useForm } from "@payloadcms/ui";
import type { JSONFieldClientComponent } from "payload";
import { useField } from "@payloadcms/ui";
import { Button, styled } from "@mui/material";
import { CloudUploadIcon } from "lucide-react";
import { Analyser } from "@/payload-types";

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

export const SelectJSON: JSONFieldClientComponent = (props) => {
  const { value, setValue, valid, showError, errorMessage } =
    useField<Analyser["data"]>();
  const [edit, setEdit] = React.useState(false);
  const { dispatchFields } = useForm();

  return (
    <div className="">
      <div className="flex items-center m-2 mb-4 gap-4 justify-between">
        <Button
          color={showError ? "error" : "primary"}
          component="label"
          sx={{ textTransform: "none" }}
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Last opp JSON
          <VisuallyHiddenInput
            type="file"
            name="analyse"
            id="analyseFile"
            accept="application/json"
            required
            onChange={(event) => {
              const file = event.target.files?.length && event.target.files[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === "string") {
                  const parsed = JSON.parse(reader.result);
                  setValue(parsed);

                  if (parsed.name)
                    dispatchFields({
                      type: "UPDATE",
                      path: "slug",
                      value: parsed.name,
                    });
                }
              };
              reader.readAsText(file);
            }}
          />
        </Button>
        {Boolean(value?.name) && (
          <span>
            <pre style={{ display: "inline" }}>{value.name}</pre>, generert{" "}
            {new Date(value.generated).toDateString()}
          </span>
        )}
        <Button
          sx={{ textTransform: "none" }}
          variant={edit ? "contained" : "outlined"}
          onClick={() => setEdit(!edit)}
        >
          Rediger JSON
        </Button>
      </div>
      {showError && <p>Noe er galt med JSON-fila: {errorMessage}</p>}
      {edit && (
        <div className="[&_#field-data]:max-h-[600px]">
          <JSONField {...props} />
        </div>
      )}
    </div>
  );
};
export default SelectJSON;
