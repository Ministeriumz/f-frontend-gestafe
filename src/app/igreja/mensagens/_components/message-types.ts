export type MessageMode = "usuario" | "tipo";

export type MessageItem = {
  id: number;
  text: string;
  mode: MessageMode;
  audienceLabel: string;
  recipients: string[];
  sent: number;
  failed: number;
  createdAt: string;
};

export type SelectOption = { value: string; label: string };
