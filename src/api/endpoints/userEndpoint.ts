import api from "../client";
import type { UpdateUserProfileDto, UserDto } from "../../models/user";

export async function getMe(): Promise<UserDto> {
  const { data } = await api.get("/User/me");
  return data?.data?.user ?? data;
}

export async function updateUserProfile(payload: UpdateUserProfileDto) {
  return api.put("/User/me", payload);
}
