import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { BookingContextProvider } from "./context/BookingContext";
import { EventContextProvider } from "./context/EventContext";
import { RoomContextProvider } from "./context/RoomContext";
import { UserContextProvider } from "./context/UserContext";

const App = () => {
  return (
    <UserContextProvider>
      <EventContextProvider>
        <RoomContextProvider>
          <BookingContextProvider>
            <Router>
              <div id="App">
                <Layout />
              </div>
            </Router>
          </BookingContextProvider>
        </RoomContextProvider>
      </EventContextProvider>
    </UserContextProvider>
  );
};

export default App;
