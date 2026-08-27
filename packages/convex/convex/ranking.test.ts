import { describe, expect, test } from "vitest";
import {
  calculateEloResult,
  calculateGameRating,
  ELO_K_FACTOR,
  INITIAL_RANKING_POINTS,
} from "./ranking";

describe("classement Elo", () => {
  test("deux joueurs à 500 échangent 16 points", () => {
    const result = calculateEloResult(
      INITIAL_RANKING_POINTS,
      INITIAL_RANKING_POINTS,
    );
    expect(ELO_K_FACTOR).toBe(32);
    expect(result.winner).toEqual({
      oldPoints: 500,
      newPoints: 516,
      delta: 16,
    });
    expect(result.loser).toEqual({
      oldPoints: 500,
      newPoints: 484,
      delta: -16,
    });
  });

  test("les points ne passent jamais sous zéro", () => {
    const result = calculateEloResult(500, 0);
    expect(result.loser.newPoints).toBe(0);
    expect(result.loser.delta).toBe(0);
  });

  test("une victoire visuelle spéciale ne change pas le calcul", () => {
    const normal = calculateEloResult(720, 640);
    const visualSpecial = calculateEloResult(720, 640);
    expect(visualSpecial).toEqual(normal);
  });

  test("l’entraînement ne modifie pas le classement", () => {
    expect(calculateGameRating("AI", false, 500, 500)).toBeNull();
  });

  test("un résultat déjà appliqué ne peut pas être rejoué", () => {
    expect(calculateGameRating("RANKED", true, 500, 500)).toBeNull();
  });
});
