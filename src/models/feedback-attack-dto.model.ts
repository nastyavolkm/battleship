import { ShotResultEnum } from "./shot-result.enum.js";

export interface FeedbackAttackDtoModel {
  position: {
    x: number,
    y: number,
  },
  currentPlayer: number,
  status: ShotResultEnum,
}
