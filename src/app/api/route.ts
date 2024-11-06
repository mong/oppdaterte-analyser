import { getAnalyse } from "@/services/mongo";

export async function POST(request: Request) {
  const res = await request.json();

  const analyse = await getAnalyse(res.analyse);
  return Response.json({ dataSubmitted: res });
}
