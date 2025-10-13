export interface CreateGroupForm {
  name: string;
  description?: string;
  color?: string;
  imageUrl?: string;
  icon?: string;
}

export interface CreatePositionForm {
  name: string;
  description?: string;
  groupId: string;
}

export interface CreateShiftForm {
  title?: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  groupId: string;
  positions: {
    positionId: string;
    requiredCount: number;
  }[];
}

export interface SignUp {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  bio?: string;
  interests?: string[];
}

export interface SignupPositionForm {
  notes?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}
