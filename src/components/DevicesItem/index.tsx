import React from "react";
import Table from "react-bootstrap/Table";
import type { Device } from "../../types";
import "./style.scss";

type DiviceItemProps = {
  device: Device | null;
  goBack: () => void;
};

export const DivicesItem: React.FC<DiviceItemProps> = ({ device, goBack }) => {
  const places = device?.places || [];
  return (
    <div className="container">
      <div className="title">Игроки на устройстве № {device?.id || ""}</div>
      <button onClick={goBack} className="back_button">
        Назад
      </button>
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
            <tr>
              <td>{i.place}</td>
              <td>{i.currency}</td>
              <td>{i.balances}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
