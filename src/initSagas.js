import * as sagas from "./sagas";
export const initSagas = (sagasMiddleware) => {
  Object.values(sagas).forEach(sagasMiddleware.run.bind(sagasMiddleware));
};
