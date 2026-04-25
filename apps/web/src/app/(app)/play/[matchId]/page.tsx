import { TableImmersive } from "@/components/table/TableImmersive";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  return <TableImmersive gameId={matchId} />;
}
