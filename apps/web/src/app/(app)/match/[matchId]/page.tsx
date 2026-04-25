import { EndgameOutcome } from "@/components/endgame/EndgameOutcome";

export default async function MatchEndPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  return <EndgameOutcome gameId={matchId} />;
}
