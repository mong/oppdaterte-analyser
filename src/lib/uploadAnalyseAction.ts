"use server";

import { uploadAnalyse } from "@/services/mongo";
import { Analyse } from "@/types";

export async function uploadAnalyseAction(prevState: any, formData: FormData) {
  const file = formData.get("analyse");
  if (!(file instanceof File) || file.type !== "application/json")
    return { success: false, message: "Feil filtype", name: "" };

  const analyse: Analyse = JSON.parse(await file.text());
  await uploadAnalyse(analyse);

  return {
    success: true,
    message: `Analysen "${analyse.name}" er nå lastet opp som en test-versjon`,
    name: analyse.name,
  };
}
