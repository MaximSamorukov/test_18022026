import React, { useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "./style.scss";

type ModalProps = {
  show: boolean;
  title: string;
  balance: number | null;
  onCancel: () => void;
  onSave: (diff: number) => void;
};

export const ModalComponent: React.FC<ModalProps> = ({
  show,
  title,
  onCancel,
  onSave,
  balance,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [operation, setOperation] = useState<"deposit" | "withdraw" | null>(
    null,
  );
  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentAmount = Number(e.target.value);
    if (!Number.isNaN(currentAmount)) {
      setAmount(currentAmount);
    }
  };
  const setDepositOperation = () => setOperation("deposit");
  const setWithdrawOperation = () => setOperation("withdraw");

  const cleanState = useCallback(() => {
    setOperation(null);
    setAmount(0);
  }, []);

  const onCloseModal = useCallback(() => {
    cleanState();
    onCancel();
  }, [onCancel, cleanState]);

  const onSaveData = useCallback(() => {
    onSave(amount);
    cleanState();
  }, [cleanState, operation, amount]);

  const isSaveActive = !!operation && amount > 0;
  return (
    <Modal show={show} autoFocus size="sm" onHide={onCloseModal}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <div className="form">
          <div className="form__balance">Баланс: {balance}</div>
          <div className="form__newbalance">Измененное значение: {balance}</div>

          <input
            onChange={handleChangeAmount}
            className="form__amount"
            value={amount}
          />
          <div className="form__controls">
            <Button
              variant={operation === "withdraw" ? "danger" : "primary"}
              onClick={setWithdrawOperation}
            >
              Withdraw
            </Button>
            <Button
              variant={operation === "deposit" ? "danger" : "primary"}
              onClick={setDepositOperation}
            >
              Deposit
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!isSaveActive} onClick={onSaveData} variant="primary">
          Сохранить
        </Button>
        <Button onClick={onCancel} variant="primary">
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
