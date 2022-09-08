export interface IRoomImages {
    id?:number,
    url: string,
    roomId: number
}

export interface IRoom {
    id?: number,
    floor: number,
    roomNumber: number,
    roomType: string,
    price: number,
    description: string,
    note: string,
    capacity?: number,
    active?: boolean,
    roomImages: IRoomImages[]
}

export interface IRoomProps {
    room: IRoom
}

export interface IManageRooms {
    roomId?: number,
    onEdit: boolean
}