import React, { useCallback, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import cn from "classnames";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { ERRORS, OP_TYPES } from "../../constants";
import "./style.scss";
import type { HandlerCurrencyValueType } from "../../types";

type ModalProps = {
  show: boolean;
  title: string;
  balance: number | null;
  onCancel: () => void;
  onSave: (diff: number) => void;
};

export const ModalComponent: React.FC<ModalProps> = React.memo(
  ({ show, title, onCancel, onSave, balance }) => {
    const [amount, setAmount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [newBalance, setNewBalance] = useState<number | null>(null);
    const [operation, setOperation] = useState<OP_TYPES | null>(null);

    const handleProcessInput = useCallback(
      (amountValue: number, opValue: OP_TYPES | null) => {
        if (opValue === OP_TYPES.DEPOSIT) {
          const oldBalanceValue = balance || 0;
          const newBalanceValue = oldBalanceValue + amountValue;
          setNewBalance(newBalanceValue);
          setErrorMessage(null);
          return;
        }
        if (opValue === OP_TYPES.WITHDRAW) {
          const oldBalanceValue = balance || 0;
          const newBalanceValue = oldBalanceValue - amountValue;
          setNewBalance(newBalanceValue);
          if (newBalanceValue < 0 && amountValue !== 0) {
            setErrorMessage(ERRORS.NEW_BALANCE_SHOULD_BE_POSITIVE);
          } else {
            setErrorMessage(null);
          }
          return;
        }
      },
      [balance, setNewBalance, setErrorMessage],
    );

    const handleChangeAmount: HandlerCurrencyValueType = useCallback(
      (_, __, data) => {
        setAmount(data?.float || 0);
        handleProcessInput(data?.float || 0, operation);
      },
      [handleProcessInput, setAmount, operation],
    );
    const setDepositOperation = useCallback(() => {
      setOperation(OP_TYPES.DEPOSIT);
      handleProcessInput(amount, OP_TYPES.DEPOSIT);
    }, [handleProcessInput, setOperation, amount]);

    const setWithdrawOperation = useCallback(() => {
      setOperation(OP_TYPES.WITHDRAW);
      handleProcessInput(amount, OP_TYPES.WITHDRAW);
    }, [handleProcessInput, setOperation, amount]);

    const cleanState = useCallback(() => {
      setErrorMessage(null);
      setNewBalance(null);
      setOperation(null);
      setAmount(0);
    }, [setErrorMessage, setOperation, setAmount, setNewBalance]);

    const onCloseModal = useCallback(() => {
      cleanState();
      onCancel();
    }, [onCancel, cleanState]);

    const onSaveData = useCallback(() => {
      const saveAmount = operation === OP_TYPES.DEPOSIT ? amount : amount * -1;
      onSave(saveAmount);
      cleanState();
    }, [cleanState, amount, onSave, operation]);

    const isSaveActive = !!operation && Number(amount) > 0 && !errorMessage;

    return (
      <Modal show={show} autoFocus size="sm" onHide={onCloseModal}>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <div className="form">
            <div className="form__balance">Баланс: {balance}</div>
            <div
              className={cn("form__newbalance", {
                ["form__newbalance_error"]: errorMessage,
              })}
            >
              Измененное значение: {newBalance}
            </div>
            <div className="form__errors">{errorMessage}</div>
            <CurrencyInput
              allowNegativeValue={false}
              className="form__amount"
              placeholder="Введите сумму"
              defaultValue={0}
              // используем 2 знака после запятой, так как работаем с денежными значениями, имеющими сотые доли
              decimalsLimit={2}
              allowDecimals
              onValueChange={handleChangeAmount}
            />
            <div className="form__controls">
              <Button
                variant={operation === OP_TYPES.WITHDRAW ? "danger" : "primary"}
                onClick={setWithdrawOperation}
              >
                Withdraw
              </Button>
              <Button
                variant={operation === OP_TYPES.DEPOSIT ? "danger" : "primary"}
                onClick={setDepositOperation}
              >
                Deposit
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!isSaveActive}
            onClick={onSaveData}
            variant="primary"
          >
            Сохранить
          </Button>
          <Button onClick={onCloseModal} variant="primary">
            Отмена
          </Button>
        </Modal.Footer>
      </Modal>
    );
  },
);
