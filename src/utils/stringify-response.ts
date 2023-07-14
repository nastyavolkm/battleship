import { WsRawDataModel } from "../models/ws-raw-data.model";

export const stringifyResponse = (response: WsRawDataModel<unknown>) => {
  const dataForResponse = JSON.stringify(response.data);
  return JSON.stringify({ ...response, data: dataForResponse });
};
