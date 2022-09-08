import axios from 'axios'
import {useEffect, useState} from 'react'
import { IEvent } from '../interfaces/event.interface'

const EventApi = () => {
    const [listEvent, setListEvent] = useState<IEvent[]>([])

    const [reload, setReload] = useState<boolean>(false)

    // Call api get list events
    useEffect(() => {
        const getEvents = async () => {
            await axios.get("http://localhost:8080/api/events")
            .then(response => {
                setListEvent(response.data as IEvent[])
            })
            .catch(error => {
                alert(error.response.data.msg);
            })
        }

        getEvents();
    }, [reload])

  return (
    {
        listEvent,
        setListEvent, reload, setReload
    }
  )
}

export default EventApi