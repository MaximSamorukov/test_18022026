import React from "react";
import Table from "react-bootstrap/Table";
import type { Device } from "../../types";
import "./style.scss";

type DivicesListProps = {
  devices: Device[];
  selectDevice: (arg: number) => void;
};

export const DivicesList: React.FC<DivicesListProps> = ({
  devices,
  selectDevice,
}) => {
  const onSelectDevice = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const deviceId = e.currentTarget.children[0].textContent;
    if (deviceId) {
      selectDevice(Number(deviceId));
    }
  };
  return (
    <div className="container">
      <div className="title">Устройства</div>
      <Table bordered responsive="sm" hover>
        <thead>
          <tr>
            <th>id</th>
            <th>Наименование</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((i) => (
            <tr onClick={onSelectDevice}>
              <td>{i.id}</td>
              <td>{i.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
