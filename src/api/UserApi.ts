import axios from 'axios'
import {useState, useEffect} from 'react'
import { IUser } from '../interfaces/user.interface'

const UserApi = () => {
    const [listUsers, setListUsers] = useState<IUser[]>([] as IUser[])

    const [role, setRole] = useState<string>("none")

    const [reload, setReload] = useState<boolean>(false)

    useEffect(() => {
        const getListUsers = async () => {
            await axios.get(`http://localhost:8080/api/users?role=${role}`)
            .then(response => {
                setListUsers(response.data)
            })
            .catch(error => {
                alert(error.response.data.msg)
            })
        }

        getListUsers()
    }, [role, reload])

  return {
    listUsers, setListUsers, role, setRole, reload, setReload
  }
}

export default UserApi