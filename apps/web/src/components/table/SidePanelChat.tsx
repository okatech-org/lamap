"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@lamap/convex/_generated/api";
import type { Id } from "@lamap/convex/_generated/dataModel";

type Props = {
  gameId: string;
  myUserId?: Id<"users">;
  myUsername?: string;
};

export function SidePanelChat({ gameId, myUserId, myUsername }: Props) {
  const messages = useQuery(api.gameChat.getGameMessages, { gameId });
  const sendMessage = useMutation(api.gameChat.sendGameMessage);
  const [draft, setDraft] = useState("");

  async function send() {
    const text = draft.trim();
    if (!text || !myUserId || !myUsername) return;
    setDraft("");
    try {
      await sendMessage({
        gameId,
        playerId: myUserId,
        playerUsername: myUsername,
        message: text,
      });
    } catch {
      // swallow
    }
  }

  return (
    <>
      <div
        style={{
          flex: 1,
          padding: "16px 14px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {(messages ?? []).map((m: any) => {
          const mine = m.playerId === myUserId;
          return (
            <div
              key={m._id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: mine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: mine ? "var(--terre-2)" : "var(--or-2)",
                  marginBottom: 2,
                }}
              >
                {mine ? "Toi" : (m.playerUsername ?? "Joueur")}
              </div>
              <div
                style={{
                  maxWidth: "80%",
                  padding: "8px 12px",
                  borderRadius: 14,
                  background: mine ? "var(--terre)" : "rgba(46,61,77,0.6)",
                  color: "var(--cream)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  borderTopRightRadius: mine ? 4 : 14,
                  borderTopLeftRadius: mine ? 14 : 4,
                }}
              >
                {m.message ?? m.text}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: 12, borderTop: "1px solid rgba(201,168,118,0.1)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 99,
            background: "rgba(46,61,77,0.5)",
            border: "1px solid rgba(201,168,118,0.12)",
          }}
        >
          <span style={{ color: "rgba(245,242,237,0.4)", fontSize: 16 }}>😀</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Écris un message…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--cream)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
            }}
          />
          <button
            onClick={send}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--or-2)",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ↵
          </button>
        </div>
      </div>
    </>
  );
}
