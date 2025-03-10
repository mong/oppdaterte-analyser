"use server";

import {
  publishAnalyseVersion,
  publishTestAnalyse,
  uploadAnalyse,
} from "@/services/mongo";
import { Analyse } from "@/types";
import { loginCredentials } from "./authorization";

export async function uploadAnalyseAction(prevState: any, formData: FormData) {
  const credentials = await loginCredentials();
  if (!credentials) {
    throw new Error("Unauthorized use of server action");
    // See https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization
  }

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

export async function changePublishedVersionAction(
  prevState: any,
  formData: FormData,
) {
  const credentials = await loginCredentials();
  if (!credentials) {
    throw new Error("Unauthorized use of server action");
  }

  const publishedVersion = Number(formData.get("publishedVersion"));
  await publishAnalyseVersion(prevState.analyseName, publishedVersion);

  return {
    analyseName: prevState.analyseName,
    version: Number(publishedVersion),
  };
}

export async function publishTestVersion(analyseName: string) {
  const credentials = await loginCredentials();
  if (!credentials) {
    throw new Error("Unauthorized use of server action");
  }

  return await publishTestAnalyse(analyseName);
}
