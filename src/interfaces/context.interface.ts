import { ReactNode } from "react";
import { IBooking } from "./booking.interface";
import { IEvent } from "./event.interface";
import { IRoom } from "./room.interface";
import { IUser } from "./user.interface";

export interface IContextProps {
    children: ReactNode
}

export interface IUserContextType {
    userInfo: IUser,
    setUserInfo: Function,
    isLogged: boolean,
    setIsLogged: Function,
    isAdmin: boolean,
    setIsAdmin: Function,
    listUsers: IUser[],
    setListUsers: Function,
    role: string,
    setRole: Function,
    reload: boolean,
    setReload: Function,
    loading: boolean, 
    setLoading: Function
}

export interface IEventContextType {
    listEvent: IEvent[],
    setListEvent: Function,
    reload: boolean, 
    setReload: Function
}

export interface IRoomContextType {
    listRoom: IRoom[],
    setListRoom: Function,
    reload: boolean,
    setReload: Function,
    roomType: string, 
    setRoomType: Function,
    startDate: string, 
    setStartDate: Function,
    endDate: string, 
    setEndDate: Function
}

export interface IBookingContextType {
    listBooking: IBooking[], 
    setListBooking: Function,
    status: string, 
    setStatus: Function,
    clientId: number, 
    setClientId: Function,
    reload: boolean, 
    setReload: Function
}