/**
 * Dashboard Hook
 * Provides dashboard summary data
 */

import { useState, useEffect } from "react";
import type { DashboardSummary } from "../models";
import { toast } from "sonner";
import { useDataAdapter } from "../api/providers/DataProvider";

export const useDashboard = () => {
  const adapter = useDataAdapter();
  const [summary, setSummary] = useState<DashboardSummary>({
    totalGroups: 0,
    totalUpcomingShifts: 0,
    myUpcomingShifts: 0,
    pendingSignups: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adapter.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar resumo";
      setError(message);
      toast.error("Erro ao carregar resumo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
};
