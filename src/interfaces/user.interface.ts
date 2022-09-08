export interface IUser {
    id?: number,
    email: string,
    password?: string,
    name: string,
    address: string,
    phone: string,
    avatar: string | null,
    role: string
}

export interface IUserInputLogin {
    email: string,
    password: string
}

export interface IUserInputRegister {
    email: string,
    password?: string,
    name: string,
    address: string,
    phone: string,
    comfirmPassword?: string
    role?: string
}

export interface IManageUsers {
    userInfo: IUser,
    onEdit: boolean,
    onChangePassword: boolean
}