import api from "../client";
import type { ShiftCompleteViewDto } from "../../models/shiftCompleteView";

export const getShiftCompleteView = async (
  shiftId: string
): Promise<ShiftCompleteViewDto> => {
  const { data } = await api.get(`/Shifts/${shiftId}/complete-view`);
  return data;
};