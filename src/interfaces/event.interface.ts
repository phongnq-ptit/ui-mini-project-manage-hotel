import { IUser } from "./user.interface";

export interface IEvent {
    id?: number,
    startDate: string,
    endDate: string,
    title: string,
    description: string,
    banner: string,
    staff?: IUser
}

export interface INewEvent {
    startDate: string,
    endDate: string,
    title: string,
    description: string,
    banner: string,
    staffId: number
}

export interface IEventProps {
    event: IEvent
}

export interface IManageEvents {
    eventId?: number,
    onEdit: boolean
}