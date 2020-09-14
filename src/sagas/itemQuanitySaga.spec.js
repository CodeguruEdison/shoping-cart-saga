import fetch from "isomorphic-fetch";
import { take, call, put, apply, select, takeLatest } from "redux-saga/effects";
import {
  handleIncreseItemQuantity,
  handleDecreseItemQuantity,
} from "./itemQuantitySaga";
import {
  INCREASE_ITEM_QUANTITY,
  DECREASE_ITEM_QUANTITY,
  setItemQuantityFetchStatus,
  decreaseItemQuantity,
  FETCHED,
  FETCHING,
} from "../actions";

import { currentUserSelector } from "../selectors";

import { fromJS } from "immutable";

describe("item quantity saga", () => {
  let item;
  let user;
  beforeEach(() => {
    item = { id: 12345 };
    user = fromJS({ id: "ABSCDE" });
  });
  describe("handle increse item quantity", () => {
    let gen;
    beforeEach(() => {
      gen = handleIncreseItemQuantity(item);
      expect(gen.next().value).toEqual(
        put(setItemQuantityFetchStatus(FETCHING))
      );
      expect(gen.next().value).toEqual(select(currentUserSelector));
      expect(gen.next(user).value).toEqual(
        call(
          fetch,
          `http://localhost:8081/cart/add/${user.get("id")}/${item.id}`
        )
      );
    });
    test("increasing quantity successfully", () => {
      expect(gen.next({ status: 200 }).value).toEqual(
        put(setItemQuantityFetchStatus(FETCHED))
      );
    });
    test("increasing quantity successfully", () => {
      expect(gen.next({ status: 500 }).value).toEqual(
        put(decreaseItemQuantity(item.id, true))
      );
      expect(gen.next().value).toEqual(
        put(setItemQuantityFetchStatus(FETCHED))
      );
    });
  });
});
