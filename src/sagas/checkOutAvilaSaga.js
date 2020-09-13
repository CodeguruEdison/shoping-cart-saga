import { take, actionChannel, put } from "redux-saga/effects";
import { SET_SHIPPING_FETCH_STATUS, setCanCheckOut, FETCHED } from "../actions";

export function* checkOutAvilaSaga() {
  const checkoutChannel = yield actionChannel(SET_SHIPPING_FETCH_STATUS);
  while (true) {
    const { status } = yield take(checkoutChannel);
    yield put(setCanCheckOut(status === FETCHED));
  }
}
