import {
  take,
  put,
  fork,
  all,
  select,
  takeLatest,
  call,
} from "redux-saga/effects";
import fetch from "isomorphic-fetch";
import {
  SET_CART_ITEMS,
  INCREASE_ITEM_QUANTITY,
  DECREASE_ITEM_QUANTITY,
  FETCHED,
  FETCHING,
  setShippingFetchStatus,
  setShippingCost,
} from "../actions";

import { cartItemsSelector } from "../selectors";

export function* shipping() {
  yield put(setShippingFetchStatus(FETCHING));
  const cartItems = yield select(cartItemsSelector);
  console.log("items", cartItems);
  const itemRequestString = cartItems
    .reduce((string, item) => {
      for (let i = 0; i < item.get("quantity"); i++) {
        string += item.get(`id`) + ",";
      }
      return string;
    }, "")
    .replace(/,\s*$/, "");

  console.info("Made ite, request string", itemRequestString);

  const response = yield fetch(
    `http://localhost:8081/shipping/${itemRequestString}`
  );
  //console.log(yield response.json());
  const result = yield response.json();
  console.log("result", result);
  const { total } = result;
  yield put(setShippingCost(total));
  yield put(setShippingFetchStatus(FETCHED));
}
export function* shippingSaga() {
  yield takeLatest(
    [SET_CART_ITEMS, INCREASE_ITEM_QUANTITY, DECREASE_ITEM_QUANTITY],
    shipping
  );
}
