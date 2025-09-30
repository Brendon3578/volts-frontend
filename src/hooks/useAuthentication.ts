import { useEffect, useState } from "react";
import type { User } from "../models/types";
import { useDataAdapter } from "../api/providers/DataProvider";

export function useAuthentication() {
  const adapter = useDataAdapter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
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
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
