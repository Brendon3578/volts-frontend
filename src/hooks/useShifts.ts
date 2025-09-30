/**
 * Shifts Hook
 * Provides shift-related data operations
 */

import { useState, useEffect } from "react";
import { useDataAdapter } from "../api/providers/DataProvider";
import type {
  Shift,
  ShiftWithDetails,
  CreateShiftForm,
  ShiftStatusType,
  VolunteerStatusType,
  SignupForm,
} from "../models/types";
import { toast } from "sonner";

export const useShifts = (groupId?: string) => {
  const adapter = useDataAdapter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await adapter.getShiftsByGroup(groupId);
      setShifts(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar escalas";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createShift = async (data: CreateShiftForm): Promise<Shift | null> => {
    try {
      const newShift = await adapter.createShift(data);
      setShifts((prev) => [...prev, newShift]);
      toast.message("Sucesso", {
        description: "Escala criada com sucesso!",
      });
      return newShift;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar escala";
      toast.error(message);
      return null;
    }
  };

  const updateShift = async (
    id: string,
    data: Partial<CreateShiftForm>
  ): Promise<Shift | null> => {
    try {
      const updatedShift = await adapter.updateShift(id, data);
      setShifts((prev) =>
        prev.map((shift) => (shift.id === id ? updatedShift : shift))
      );
      toast.message("Sucesso", {
        description: "Escala atualizada com sucesso!",
      });
      return updatedShift;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar escala";
      toast.error(message);
      return null;
    }
  };

  const deleteShift = async (id: string): Promise<boolean> => {
    try {
      await adapter.deleteShift(id);
      setShifts((prev) => prev.filter((shift) => shift.id !== id));
      toast.message("Sucesso", {
        description: "Escala excluída com sucesso!",
      });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir escala";
      toast.error(message);
      return false;
    }
  };

  const updateShiftStatus = async (
    id: string,
    status: ShiftStatusType
  ): Promise<boolean> => {
    try {
      const updatedShift = await adapter.updateShiftStatus(id, status);
      setShifts((prev) =>
        prev.map((shift) => (shift.id === id ? updatedShift : shift))
      );
      toast.message("Sucesso", {
        description: "Status da escala atualizado!",
      });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar status";
      toast.error(message);
      return false;
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [groupId]);

  return {
    shifts,
    loading,
    error,
    createShift,
    updateShift,
    deleteShift,
    updateShiftStatus,
    refetch: fetchShifts,
  };
};

export const useShift = (id: string) => {
  const adapter = useDataAdapter();
  const [shift, setShift] = useState<ShiftWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShift = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adapter.getShiftById(id);
      setShift(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar escala";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const signupForShift = async (
    shiftPositionId: string,
    data: SignupForm
  ): Promise<boolean> => {
    try {
      await adapter.signupForShift(shiftPositionId, data);
      toast.message("Sucesso", {
        description: "Inscrição realizada com sucesso!",
      });
      // Refresh shift data
      fetchShift();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao se inscrever";
      toast.error(message);
      return false;
    }
  };

  const cancelSignup = async (shiftVolunteerId: string): Promise<boolean> => {
    try {
      await adapter.cancelSignup(shiftVolunteerId);
      toast.message("Sucesso", {
        description: "Inscrição cancelada com sucesso!",
      });
      // Refresh shift data
      fetchShift();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao cancelar inscrição";
      toast.error(message);
      return false;
    }
  };

  const updateVolunteerStatus = async (
    shiftVolunteerId: string,
    status: VolunteerStatusType
  ): Promise<boolean> => {
    try {
      await adapter.updateVolunteerStatus(shiftVolunteerId, status);
      toast.message("Sucesso", {
        description: "Status do voluntário atualizado!",
      });
      // Refresh shift data
      fetchShift();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar status";
      toast.error(message);
      return false;
    }
  };

  useEffect(() => {
    if (id) {
      fetchShift();
    }
  }, [id]);

  return {
    shift,
    loading,
    error,
    signupForShift,
    cancelSignup,
    updateVolunteerStatus,
    refetch: fetchShift,
  };
};
