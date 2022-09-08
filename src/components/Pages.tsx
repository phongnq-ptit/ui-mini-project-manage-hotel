import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DetailBooking from "./admin/manage_bookings/DetailBooking";
import EditBooking from "./admin/manage_bookings/EditBooking";
import ManageBooking from "./admin/manage_bookings/ManageBooking";
import ManageEvents from "./admin/manage_events/ManageEvents";
import ManageRooms from "./admin/manage_rooms/ManageRooms";
import ManageUser from "./admin/manage_user/ManageUser";
import Account from "./client/account/Account";
import Booking from "./client/booking/Booking";
import EventDetail from "./client/events/EventDetail";
import Events from "./client/events/Events";
import HistoryBooking from "./client/history_booking/HistoryBooking";
import Home from "./client/home/Home";
import RoomDetail from "./client/room/RoomDetail";
import Rooms from "./client/room/Rooms";
import Page404 from "./common/exception/Page404";
import Login from "./common/login/Login";
import Register from "./common/register/Register";

const Pages = () => {
  const { isLogged, isAdmin } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/booking" element={<Booking />} />

      <Route path="/rooms" element={<Rooms />} />

      <Route path="/rooms/:id" element={<RoomDetail />} />

      <Route path="/events" element={<Events />} />

      <Route path="/events/:id" element={<EventDetail />} />

      <Route path="/account" element={isLogged ? <Account /> : <Page404 />} />

      <Route
        path="/history_booking"
        element={isLogged ? <HistoryBooking /> : <Page404 />}
      />

      <Route path="/admin" element={isAdmin ? <ManageUser /> : <Login />} />

      <Route
        path="/admin/manage_users"
        element={isAdmin ? <ManageUser /> : <Login />}
      />

      <Route
        path="/admin/manage_rooms"
        element={isAdmin ? <ManageRooms /> : <Login />}
      />

      <Route
        path="/admin/manage_events"
        element={isAdmin ? <ManageEvents /> : <Login />}
      />

      <Route
        path="/admin/manage_bookings"
        element={isAdmin ? <ManageBooking /> : <Login />}
      />

      <Route
        path="/admin/manage_bookings/detail/:id"
        element={isAdmin ? <DetailBooking /> : <Login />}
      />

      <Route
        path="/admin/manage_bookings/edit/:id"
        element={isAdmin ? <EditBooking /> : <Login />}
      />

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default Pages;
