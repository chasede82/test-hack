import { apiInstance } from "@/shared/api/instance";
import { User } from "@/entities/user/model/types";

export async function getMe(): Promise<User> {
  const { data } = await apiInstance.get<User>("/users/me");
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<{ accessToken: string; user: User }> {
  const { data } = await apiInstance.post<{ accessToken: string; user: User }>(
    "/auth/login",
    { email, password }
  );
  return data;
}

export async function getUsers(): Promise<User[]> {
  const { data } = await apiInstance.get<User[]>("/users");
  return data;
}
