import { IRoom } from "./room.interface"
import { IUser } from "./user.interface"

export interface IBooking {
    id?: number,
    startDate: string,
    endDate: string,
    note: string,
    status: string,
    star?: number,
    comment?: string,
    client: IUser,
    bookedRoom: IRoom[]
}

export interface IBookingProps {
    booking: IBooking,
    no: number
}