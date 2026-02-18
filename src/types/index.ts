import type { CurrencyInputOnChangeValues } from "react-currency-input-field";

export type Place = {
  balances: number;
  currency: string;
  device_id: number;
  place: number;
};

export type Device = {
  created_at: string;
  id: number;
  name: string;
  places: Place[];
  updated_at: string;
};

export type Error = {
  data?: string;
  err: string;
};

export type BalanceUpdate = {
  delta: number;
};

export type HandlerCurrencyValueType =
  | ((
      value: string | undefined,
      name?: string | undefined,
      values?: CurrencyInputOnChangeValues | undefined,
    ) => void)
  | undefined;
