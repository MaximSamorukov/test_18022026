import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api";
import type { Device, Place } from "../types";
import { ERRORS, SUCCESS } from "../constants";

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [device, setDevice] = useState<Device | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_place, setPlace] = useState<Place | null>(null);
  const [balanceUpdateInProgress, setBalanceUpdateInProgress] =
    useState<boolean>(false);

  useEffect(() => {
    if (!device?.id) {
      api.getDevices().then((data) => {
        setDevices(data);
      });
    }
  }, [device?.id]);

  const selectDevice = useCallback((id: number) => {
    api
      .getDeviceById(id.toString())
      .then((data) => {
        setDevice(data);
      })
      .catch(() => {
        setDevice(null);
      });
  }, []);
  const getBackToDeviceList = useCallback(() => {
    setDevice(null);
    setPlace(null);
  }, []);

  const updateBalance = useCallback(
    (delta: number, deviceId: number, placeId: number) => {
      setBalanceUpdateInProgress(true);
      api
        .updateBalance(deviceId.toString(), placeId.toString(), { delta })
        .then((data) => {
          if (data) {
            setPlace(data);
            setDevice((d) => {
              if (!d) return d;
              const updatedPlaces = (d?.places || []).map((i) => {
                if (i.place === placeId) {
                  return data;
                }
                return i;
              });
              return {
                ...d,
                places: updatedPlaces,
              };
            });
            toast.success(SUCCESS.ON_UPDATE_BALANCE);
          }
          if (data === null) {
            toast.error(ERRORS.UPDATE_BALANCE_ERROR);
          }
        })
        .finally(() => {
          setBalanceUpdateInProgress(false);
        });
    },
    [],
  );
  return {
    device,
    devices,
    selectDevice,
    getBackToDeviceList,
    balanceUpdateInProgress,
    updateBalance,
  };
};
