"use client";

import { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel as SignalRLogLevel } from "@microsoft/signalr";

import { API_BASE_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useCrud } from "./useCrud";

export interface LogDTO {
  id?: number;
  data: string;
  hora: string;
  acao: string;
  idUsuario?: number | null;
}

export type LogConnectionState = "connecting" | "connected" | "reconnecting" | "disconnected";

export function useLogs() {
  const crud = useCrud<LogDTO>({ endpoint: "Log" });
  const [connectionState, setConnectionState] = useState<LogConnectionState>("connecting");
  const realtimeId = useRef(-1);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setConnectionState("disconnected");
      return;
    }

    let disposed = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/loghub`, { accessTokenFactory: () => getToken() ?? "" })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(SignalRLogLevel.Warning)
      .build();

    connection.on("ReceberLog", (log: LogDTO) => {
      const realtimeLog = log.id && log.id > 0
        ? log
        : { ...log, id: realtimeId.current-- };
      crud.setData((current) => {
        if (current.some((item) => item.id === realtimeLog.id)) return current;
        return [realtimeLog, ...current];
      });
    });
    connection.onreconnecting(() => !disposed && setConnectionState("reconnecting"));
    connection.onreconnected(() => !disposed && setConnectionState("connected"));
    connection.onclose(() => !disposed && setConnectionState("disconnected"));

    const start = async () => {
      try {
        await connection.start();
        if (!disposed) setConnectionState("connected");
      } catch {
        if (!disposed) {
          setConnectionState("disconnected");
          retryTimer = setTimeout(() => {
            if (disposed) return;
            setConnectionState("connecting");
            void start();
          }, 5000);
        }
      }
    };

    void start();
    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      connection.off("ReceberLog");
      void connection.stop();
    };
  }, [crud.setData]);

  return { ...crud, connectionState };
}

export default useLogs;
