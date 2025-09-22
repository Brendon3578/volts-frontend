/**
 * Groups Hook
 * Provides group-related data operations
 */

import { useState, useEffect } from "react";
import { useDataAdapter } from "../api/providers/DataProvider";
import type { Group, GroupWithDetails, CreateGroupForm } from "../models/types";
import { toast } from "sonner";

export const useGroups = () => {
  const adapter = useDataAdapter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adapter.getGroups();
      setGroups(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar grupos";
      setError(message);
      toast.error("Erro ao carregar grupos");
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (data: CreateGroupForm): Promise<Group | null> => {
    try {
      const newGroup = await adapter.createGroup(data);
      setGroups((prev) => [...prev, newGroup]);
      toast.message("Sucesso", {
        description: "Grupo criado com sucesso!",
      });
      return newGroup;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar grupo";
      toast.error(message);
      return null;
    }
  };

  const updateGroup = async (
    id: string,
    data: Partial<CreateGroupForm>
  ): Promise<Group | null> => {
    try {
      const updatedGroup = await adapter.updateGroup(id, data);
      setGroups((prev) =>
        prev.map((group) => (group.id === id ? updatedGroup : group))
      );
      toast.message("Sucesso", {
        description: "Grupo atualizado com sucesso!",
      });
      return updatedGroup;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar grupo";
      toast.error(message);
      return null;
    }
  };

  const deleteGroup = async (id: string): Promise<boolean> => {
    try {
      await adapter.deleteGroup(id);
      setGroups((prev) => prev.filter((group) => group.id !== id));

      toast.message("Sucesso", {
        description: "Grupo excluído com sucesso!",
      });

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir grupo";

      toast.error(message);

      return false;
    }
  };

  const joinGroup = async (groupId: string): Promise<boolean> => {
    try {
      await adapter.joinGroup(groupId);

      toast.message("Sucesso", {
        description: "Você entrou no grupo com sucesso!",
      });
      // Refresh groups to update member count
      fetchGroups();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao entrar no grupo";

      toast.error(message);

      return false;
    }
  };

  const leaveGroup = async (groupId: string): Promise<boolean> => {
    try {
      await adapter.leaveGroup(groupId);

      toast.message("Sucesso", {
        description: "Você saiu do grupo com sucesso!",
      });
      // Refresh groups to update member count
      fetchGroups();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao sair do grupo";

      toast.error(message);

      return false;
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    refetch: fetchGroups,
  };
};

export const useGroup = (id: string) => {
  const adapter = useDataAdapter();
  const [group, setGroup] = useState<GroupWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adapter.getGroupById(id);
      setGroup(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar grupo";
      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGroup();
    }
  }, [id]);

  return {
    group,
    loading,
    error,
    refetch: fetchGroup,
  };
};
