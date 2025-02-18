import { uploadAnalyse } from "@/services/mongo";
import { Analyse } from "@/types";

export async function POST(request: Request) {
  const analyse: Analyse = await request.json();

  return uploadAnalyse(analyse);
}
