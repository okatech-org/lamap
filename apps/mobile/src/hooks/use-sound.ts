import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";

type SoundType = "cardPlay" | "cardSelect" | "victory" | "kora" | "defeat";

const sounds = {
  cardPlay: require("@assets/sounds/game/card-play.mp3"),
  cardSelect: require("@assets/sounds/game/card-select.mp3"),
  victory: require("@assets/sounds/special/victory.mp3"),
  kora: require("@assets/sounds/special/kora-simple.mp3"),
  defeat: require("@assets/sounds/special/defeat.mp3"),
} as const;

export function useSound() {
  const [isLoaded, setIsLoaded] = useState(false);
  const cardPlay = useAudioPlayer(sounds.cardPlay);
  const cardSelect = useAudioPlayer(sounds.cardSelect);
  const victory = useAudioPlayer(sounds.victory);
  const kora = useAudioPlayer(sounds.kora);
  const defeat = useAudioPlayer(sounds.defeat);
  const players = useMemo(
    () => ({ cardPlay, cardSelect, victory, kora, defeat }),
    [cardPlay, cardSelect, victory, kora, defeat],
  );

  useEffect(() => {
    async function initializeAudio() {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: "mixWithOthers",
          interruptionModeAndroid: "duckOthers",
        });
        Object.values(players).forEach((player) => {
          player.volume = 0.7;
        });
        setIsLoaded(true);
      } catch (error) {
        console.warn("Impossible d’initialiser l’audio", error);
        setIsLoaded(false);
      }
    }
    void initializeAudio();
  }, [players]);

  const playSound = async (type: SoundType) => {
    try {
      const player = players[type];
      if (isLoaded) {
        if (player.playing) await player.pause();
        await player.seekTo(0);
        player.play();
      }

      if (type === "defeat") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (type === "victory") {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } else {
        await Haptics.impactAsync(
          type === "kora"
            ? Haptics.ImpactFeedbackStyle.Heavy
            : Haptics.ImpactFeedbackStyle.Light,
        );
      }
    } catch (error) {
      console.warn(`Impossible de jouer le son ${type}`, error);
    }
  };

  return { playSound, isLoaded };
}
