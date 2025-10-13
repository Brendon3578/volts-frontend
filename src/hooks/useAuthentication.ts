import { useEffect, useState, useCallback } from "react";
import type { User } from "../models";
import { useDataAdapter } from "../api/providers/DataProvider";

export function useAuthentication() {
  const adapter = useDataAdapter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedUser = await adapter.getCurrentUser();
      setUser(fetchedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [adapter]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
