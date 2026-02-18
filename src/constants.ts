export const OP_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
} as const;

export type OP_TYPES = (typeof OP_TYPES)[keyof typeof OP_TYPES];

export const ERRORS = {
  NEW_BALANCE_SHOULD_BE_POSITIVE:
    "Новое значение баланса не может быть отрицательным.",
};
