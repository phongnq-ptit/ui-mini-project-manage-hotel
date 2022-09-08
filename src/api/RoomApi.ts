import axios from "axios";
import { useEffect, useState } from "react";
import { IRoom } from "../interfaces/room.interface";

const RoomApi = () => {
  const [listRoom, setListRoom] = useState<IRoom[]>([] as IRoom[]);

  const [roomType, setRoomType] = useState<string>('none')

  const [reload, setReload] = useState<boolean>(false)

  const [startDate, setStartDate] = useState<string>('none')

  const [endDate, setEndDate] = useState<string>('none')

  // call api get list room
  useEffect(() => {
    const getListRoom = async () => {
      await axios
        .get(`http://localhost:8080/api/rooms?room_type=${roomType}&start_date=${startDate}&end_date=${endDate}`)
        .then((response) => {
          setListRoom(response.data);
        })
        .catch((error) => {
          alert(error.response.data.msg);
        });
    };

    getListRoom();
  }, [roomType, startDate, endDate, reload]);

  return {
    listRoom,
    setListRoom,
    reload, 
    setReload,
    roomType, 
    setRoomType,
    startDate, 
    setStartDate,
    endDate, 
    setEndDate
  };
};

export default RoomApi;
