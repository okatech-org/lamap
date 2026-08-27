import { api } from "@lamap/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useCallback } from "react";

export function useMatchmaking() {
  const queue = useQuery(api.matchmaking.getMyStatus, {});
  const join = useMutation(api.matchmaking.joinQueue);
  const leave = useMutation(api.matchmaking.leaveQueue);
  const createTrainingMutation = useMutation(api.games.createTraining);
  const joinQueue = useCallback(() => join({}), [join]);
  const leaveQueue = useCallback(() => leave({}), [leave]);
  const createTraining = useCallback(
    async (difficulty: "easy" | "medium" | "hard") => {
      const result = await createTrainingMutation({ difficulty });
      return result.gameId;
    },
    [createTrainingMutation],
  );
  return {
    status: queue?.status ?? "idle",
    gameId: queue?.status === "matched" ? queue.gameId : undefined,
    opponent: queue?.status === "matched" ? queue.opponent : undefined,
    joinedAt: queue && queue.status !== "idle" ? queue.joinedAt : undefined,
    joinQueue,
    leaveQueue,
    createTraining,
  };
}
