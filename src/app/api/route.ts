import { updateAnalyse } from "@/services/mongo";
import { Analyse } from "@/types";

export async function POST(request: Request) {
  const res: Analyse = await request.json();

  updateAnalyse(res);

  return Response.json({ dataSubmitted: res });
}
