export interface IAuthContext {
  user: IUser | null;
  updateUserData: (user: IUser | null) => void;
}

export interface IUser {
  userId: string | null;
  phoneNumber: string | null;
  name: string | null;
}

export interface ILoginFormInputs {
  phoneNumber: string;
  password: string;
}

export interface ILoginResponse {
  data: IUser | null;
  message: string;
  status?: boolean;
}
