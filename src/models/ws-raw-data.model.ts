import { MessageType } from "./message-type.enum";

export interface WsRawDataModel<T> {
  type: MessageType,
  id: number,
  data: T,
}
