export type ScaleView = {
  id: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  cargoId: number;
};

export type ShiftGroup = {
  key: string;
  inicio: string;
  fim: string;
  scales: ScaleView[];
};

export type RoleOption = { id: number; nome: string };

export type NewShiftInput = {
  horaInicio: string;
  horaFim: string;
  cargoId: string;
};
