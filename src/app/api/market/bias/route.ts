import { getMultiTimeframeBias } from "@/lib/market-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") ?? undefined;

  const result = await getMultiTimeframeBias(symbol);
  return Response.json(result);
}
