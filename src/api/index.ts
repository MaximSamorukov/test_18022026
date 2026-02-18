import type { BalanceUpdate, Device, Error, Place } from "../types";

class Api {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T | Error> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });

      if (!response.ok) {
        const body: Error = await response.json();

        return body;
      }

      const data: T = await response.json();
      return data;
    } catch (e) {
      return {
        data: "Ошибка",
        err: "Ошибка",
      };
    }
  }

  get<T>(endpoint: string): Promise<T | Error> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T, U>(endpoint: string, body: U): Promise<T | Error> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  async getDevices(): Promise<Device[]> {
    const result = await this.get<Device[]>("/a/devices");
    if ("err" in result) {
      return [];
    }
    return result;
  }
  async getDeviceById(id: string): Promise<Device | null> {
    const result = await this.get<Device>(`/a/devices/${id}`);
    if ("err" in result) {
      return null;
    }
    return result;
  }
  async updateBalance(
    deviceId: string,
    placeId: string,
    data: BalanceUpdate,
  ): Promise<Place | null> {
    const result = await this.post<Place, BalanceUpdate>(
      `/a/devices/${deviceId}/place/${placeId}/update`,
      data,
    );
    if ("err" in result) {
      return null;
    }
    return result;
  }
}

export const api = new Api("https://dev-space.su/api/v1");
