import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateUserProfile } from "../api/endpoints";
import type { UpdateUserProfileDto } from "../models/user";
import { DEFAULT_REACT_QUERY_STALE_TIME } from "../utils";
import { useAuth } from "../context/Auth/useAuth";

export const useMe = () => {
  const { state } = useAuth();
  const user = state.user;

  const queryKey = user ? ["me", `me-${user.id}`] : ["me"];

  return useQuery({
    queryKey: queryKey,
    queryFn: getMe,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
    retry: 1,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const { state } = useAuth();
  const user = state.user;

  const queryKey = user ? ["me", `me-${user.id}`] : ["me"];

  return useMutation({
    mutationFn: (payload: UpdateUserProfileDto) => updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
};
