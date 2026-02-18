import { useDevices } from "./hooks/useDevices";
import { DivicesList } from "./components/DevicesList";
import "./app.scss";
import { DivicesItem } from "./components/DevicesItem";

export const App = () => {
  const { devices, device, selectDevice, getBackToDeviceList } = useDevices();

  return (
    <div className="container">
      {device ? (
        <DivicesItem goBack={getBackToDeviceList} device={device} />
      ) : (
        <DivicesList devices={devices} selectDevice={selectDevice} />
      )}
    </div>
  );
};
