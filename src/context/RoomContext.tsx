import { createContext } from "react";
import RoomApi from "../api/RoomApi";
import {
  IContextProps,
  IRoomContextType,
} from "../interfaces/context.interface";
import { IRoom } from "../interfaces/room.interface";

export const RoomContext = createContext<IRoomContextType>({
  listRoom: [] as IRoom[],
  setListRoom: (listRoom: IRoom[]) => {},
  reload: false,
  setReload: (reload: boolean) => {},
  roomType: "none",
  setRoomType: (roomType: string) => {},
  startDate: "none",
  setStartDate: (startDate: string) => {},
  endDate: "none",
  setEndDate: (endDate: string) => {},
});

export const RoomContextProvider = ({ children }: IContextProps) => {
  const {
    listRoom,
    setListRoom,
    reload,
    setReload,
    roomType,
    setRoomType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = RoomApi();

  const roomState = {
    listRoom,
    setListRoom,
    reload,
    setReload,
    roomType,
    setRoomType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };

  return (
    <RoomContext.Provider value={roomState}>{children}</RoomContext.Provider>
  );
};
