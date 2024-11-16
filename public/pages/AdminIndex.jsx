const { useState, useEffect } = React
import { userService } from "../services/user.service.js"
import { UserIndex } from './UserIndex.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'


export function AdminIndex() {
    const user = userService.getLoggedinUser()
    const [users, setUsers] = useState([])

    useEffect(() => {
        userService.query().then(setUsers)
    }, [])

    function onRemoveUser(userId) {

        console.log(userId)
        userService
            .remove(userId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const usersToUpdate = users.filter((user) => user._id !== userId)
                setUsers(usersToUpdate)
                showSuccessMsg('User removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveUser ->', err)
                showErrorMsg('Cannot remove user')
            })
    }

    if (!user || !user.isAdmin) return <div>You are not allowed in this page</div>

    return (
        <section>
            <h1>User Managment</h1>
            <UserIndex
                users={users}
                onRemoveUser={onRemoveUser} />
        </section>
    )
}