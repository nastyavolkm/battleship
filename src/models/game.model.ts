import { PlayerModel } from "./player.model.js";
import { GameStateType } from "./game-state-type.js";

export interface GameModel {
  idGame: number,
  players: PlayerModel[],
  state: GameStateType,
}
