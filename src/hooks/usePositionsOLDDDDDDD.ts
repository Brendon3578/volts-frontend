/**
 * Positions Hook
 * Provides position-related data operations
 */

import { useState, useEffect } from "react";
import { useDataAdapter } from "../api/providers/DataProvider";
import type { Position, CreatePositionForm } from "../models";
import { toast } from "sonner";

export const usePositionsOLDDDDD = (groupId?: string) => {
  const adapter = useDataAdapter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await adapter.getPositionsByGroup(groupId);
      setPositions(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar posições";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createPosition = async (
    data: CreatePositionForm
  ): Promise<Position | null> => {
    try {
      const newPosition = await adapter.createPosition(data);
      setPositions((prev) => [...prev, newPosition]);
      toast.message("Sucesso", {
        description: "Posição criada com sucesso!",
      });

      return newPosition;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar posição";
      toast.error(message);

      return null;
    }
  };

  const updatePosition = async (
    id: string,
    data: Partial<CreatePositionForm>
  ): Promise<Position | null> => {
    try {
      const updatedPosition = await adapter.updatePosition(id, data);
      setPositions((prev) =>
        prev.map((position) =>
          position.id === id ? updatedPosition : position
        )
      );
      toast.message("Sucesso", {
        description: "Posição atualizada com sucesso!",
      });
      return updatedPosition;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar posição";
      toast.error(message);
      return null;
    }
  };

  const deletePosition = async (id: string): Promise<boolean> => {
    try {
      await adapter.deletePosition(id);
      setPositions((prev) => prev.filter((position) => position.id !== id));
      toast.message("Sucesso", {
        description: "Posição excluída com sucesso!",
      });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir posição";
      toast.error(message);
      return false;
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [groupId]);

  return {
    positions,
    loading,
    error,
    createPosition,
    updatePosition,
    deletePosition,
    refetch: fetchPositions,
  };
};
