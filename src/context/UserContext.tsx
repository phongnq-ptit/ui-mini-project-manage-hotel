import { createContext, useEffect, useState } from "react";
import UserApi from "../api/UserApi";
import {
  IContextProps,
  IUserContextType,
} from "../interfaces/context.interface";
import { IUser } from "../interfaces/user.interface";

export const UserContext = createContext<IUserContextType>({
  userInfo: {} as IUser,
  setUserInfo: (userInfo: IUser) => {},
  isLogged: false,
  setIsLogged: (isLogged: boolean) => {},
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => {},
  listUsers: [] as IUser[],
  setListUsers: (listUsers: IUser[]) => {},
  role: "none",
  setRole: (role: string) => {},
  reload: false,
  setReload: (reload: boolean) => {},
  loading: false,
  setLoading: (loading: boolean) => {},
});

export const UserContextProvider = ({ children }: IContextProps) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<IUser | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const { listUsers, setListUsers, role, setRole, reload, setReload } =
    UserApi();

  useEffect(() => {
    const getUser = () => {
      const checkLogin = localStorage.getItem("userInfo");

      const userLogin = checkLogin === null ? null : JSON.parse(checkLogin);

      if (userLogin) {
        setUserInfo(userLogin);
        setIsLogged(true);
        setIsAdmin(userLogin.role === "admin");
      }
    };

    getUser();
  }, []);

  const userState = {
    userInfo,
    setUserInfo,
    isLogged,
    setIsLogged,
    isAdmin,
    setIsAdmin,
    listUsers,
    setListUsers,
    role,
    setRole,
    reload,
    setReload,
    loading,
    setLoading,
  };

  return (
    <UserContext.Provider value={userState as IUserContextType}>
      {children}
    </UserContext.Provider>
  );
};
