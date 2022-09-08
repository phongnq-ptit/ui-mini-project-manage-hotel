import { createContext } from "react";
import EventApi from "../api/EventApi";
import {
  IContextProps,
  IEventContextType,
} from "../interfaces/context.interface";
import { IEvent } from "../interfaces/event.interface";

export const EventContext = createContext<IEventContextType>({
  listEvent: [],
  setListEvent: (listEvent: IEvent[]) => {},
  reload: false,
  setReload: (reload: boolean) => {},
});

export const EventContextProvider = ({ children }: IContextProps) => {
  const { listEvent, setListEvent, reload, setReload } = EventApi();

  const eventState = {
    listEvent,
    setListEvent,
    reload,
    setReload,
  };

  return (
    <EventContext.Provider value={eventState as IEventContextType}>
      {children}
    </EventContext.Provider>
  );
};
