import React, { useCallback, useState } from "react";
import { Toaster } from "react-hot-toast";
import Table from "react-bootstrap/Table";
import type { Device } from "../../types";
import "./style.scss";
import { ModalComponent } from "../ModalComponent";
import { useDevices } from "../../hooks/useDevices";
import { Button } from "react-bootstrap";

type DiviceItemProps = {
  device: Device | null;
  goBack: () => void;
};

export const DivicesItem: React.FC<DiviceItemProps> = ({ device, goBack }) => {
  const { updateBalance } = useDevices();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedPlaceBalance, setSelectedPlaceBalance] = useState<
    number | null
  >(null);
  const [showModal, setShowModal] = useState(false);

  const places = device?.places || [];

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedPlaceId(null);
    setSelectedPlaceBalance(null);
  }, [setShowModal, setSelectedPlaceId, setSelectedPlaceBalance]);

  const handleSave = useCallback(
    async (diff: number) => {
      if (device?.id && selectedPlaceId) {
        await updateBalance(diff, device?.id, Number(selectedPlaceId));
      }
      handleCloseModal();
    },
    [device?.id, selectedPlaceId, handleCloseModal, updateBalance],
  );
  const handleSelectPlace = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const [idNode, , balanceNode] = e.currentTarget.childNodes;
    const placeId = idNode.textContent;
    const balance = balanceNode.textContent;
    if (placeId) {
      setSelectedPlaceId(placeId);
      setSelectedPlaceBalance(Number(balance));
      setShowModal(true);
    }
  };
  return (
    <div className="container">
      <div className="title">
        Игроки.
        <br />
        Устройство № {device?.id || ""}
      </div>
      <Button variant="primary" onClick={goBack}>
        Назад
      </Button>
      <Table bordered responsive="sm" hover>
        <thead>
          <tr>
            <th>id игрока</th>
            <th>Валюта</th>
            <th>Баланс</th>
          </tr>
        </thead>
        <tbody>
          {places.map((i) => (
            <tr key={i.place} onClick={handleSelectPlace}>
              <td>{i.place}</td>
              <td>{i.currency}</td>
              <td>{i.balances}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalComponent
        balance={selectedPlaceBalance}
        onSave={handleSave}
        onCancel={handleCloseModal}
        title="Редактирование баланса"
        show={showModal}
      />
      <Toaster toastOptions={{ duration: 1500 }} />
    </div>
  );
};
