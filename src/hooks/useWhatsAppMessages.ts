"use client";

import { useCallback, useState } from "react";

import { apiRequest, type ApiResponse, ResponseCode } from "@/lib/api";

export type SendAudienceMessagePayload = {
  recipients: Array<{ phone: string }>;
  text: string;
};

export type AudienceMessageResult = {
  totalRecipients: number;
  sent: number;
  failed: number;
};

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function useWhatsAppMessages() {
  const [loading, setLoading] = useState(false);

  const send = useCallback(async (
    payload: SendAudienceMessagePayload
  ): Promise<ApiResponse<AudienceMessageResult>> => {
    setLoading(true);
    try {
      const phoneGroups = new Map<string, number>();

      payload.recipients.forEach(({ phone }) => {
        const normalized = normalizePhone(phone);
        if (normalized.length < 10 || normalized.length > 15) {
          return;
        }
        phoneGroups.set(normalized, (phoneGroups.get(normalized) ?? 0) + 1);
      });

      const deliveries = await Promise.all(
        [...phoneGroups.entries()].map(async ([phone, recipientCount]) => {
          const response = await apiRequest<null>("/api/WhatsApp/send-test", {
            method: "POST",
            body: JSON.stringify({ phone, text: payload.text }),
          });
          return response.code === ResponseCode.SUCCESS ? recipientCount : 0;
        })
      );

      const sent = deliveries.reduce((total, delivered) => total + delivered, 0);
      const totalRecipients = payload.recipients.length;
      const failed = totalRecipients - sent;
      return {
        code: sent > 0 ? ResponseCode.SUCCESS : ResponseCode.ERROR,
        message: sent > 0
          ? failed > 0 ? "Mensagem enviada parcialmente" : "Mensagem enviada com sucesso"
          : "Não foi possível enviar a mensagem",
        data: { totalRecipients, sent, failed },
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { send, loading };
}

export default useWhatsAppMessages;
