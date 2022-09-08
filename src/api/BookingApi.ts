import axios from 'axios'
import { useEffect, useState } from 'react'
import { IBooking } from '../interfaces/booking.interface'

const BookingApi = () => {
    const [listBooking, setListBooking] = useState<IBooking[]>([] as IBooking[])

    const [status, setStatus] = useState<string>('none')

    const [clientId, setClientId] = useState<number>(-1)

    const [reload, setReload] = useState<boolean>(false)

    useEffect(() => {
        const getListBooking = async () => {
            await axios.get(`http://localhost:8080/api/bookings?status=${status}&clientId=${clientId}`)
            .then(response => {
                setListBooking(response.data)
            })
            .catch(error => {
                alert(error.response.data.msg);
            })
        }

        getListBooking()
    }, [status, clientId, reload])


  return {
    listBooking: listBooking.slice().reverse(), 
    setListBooking,
    status, 
    setStatus,
    clientId, 
    setClientId,
    reload, 
    setReload
  }
}

export default BookingApi