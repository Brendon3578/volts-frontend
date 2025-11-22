export interface UpdateUserProfileDto {
  name: string;
  phone?: string;
  bio?: string;
  birthdate?: string;
  gender?: string;
  email?: string; // apenas pra mosrar, mas nao vai mudar
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  birthdate?: string;
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}
