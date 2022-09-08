import { createContext } from "react";
import BookingApi from "../api/BookingApi";
import { IBooking } from "../interfaces/booking.interface";
import {
  IBookingContextType,
  IContextProps,
} from "../interfaces/context.interface";

export const BookingContext = createContext<IBookingContextType>({
  listBooking: [],
  setListBooking: (listBooking: IBooking[]) => {},
  status: "none",
  setStatus: (status: string) => {},
  clientId: -1,
  setClientId: (clientId: number) => {},
  reload: false,
  setReload: (reload: boolean) => {},
});

export const BookingContextProvider = ({ children }: IContextProps) => {
  const {
    listBooking,
    setListBooking,
    status,
    setStatus,
    clientId,
    setClientId,
    reload,
    setReload,
  } = BookingApi();

  const bookingState = {
    listBooking,
    setListBooking,
    status,
    setStatus,
    clientId,
    setClientId,
    reload,
    setReload,
  };

  return (
    <BookingContext.Provider value={bookingState as IBookingContextType}>
      {children}
    </BookingContext.Provider>
  );
};
