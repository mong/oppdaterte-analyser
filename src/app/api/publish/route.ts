import { publishAnalyse } from "@/services/mongo";

export async function POST(request: Request) {
  const analyseName = await request.text();

  return publishAnalyse(analyseName);
}
