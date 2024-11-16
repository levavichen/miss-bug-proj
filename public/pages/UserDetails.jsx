const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { BugList } from '../cmps/BugList.jsx'
import { bugService } from '../services/bug.service.js'
import { userService } from "../services/user.service.js"

export function UserDetails() {
// debugger
    const [user, setUser] = useState(userService.getLoggedinUser())
    const [bugs, setBugs] = useState([])
    // const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
          navigate('/')
          return
        }
        loadUserBugs()
      }, [user])

    // function loadUser() {
    //     userService.getById(params.userId)
    //         .then(setUser)
    //         .catch(err => {
    //             console.log('err:', err)
    //             navigate('/')
    //         })
    // }

    function loadUserBugs() {
        console.log(user)
        bugService.query({ userId: user._id }).then(res => {
    
          setBugs(res)
        })
      }

    function onBack() {
        navigate('/')
    }

    if (!user) return <div>Loading...</div>

    return <section className="user-details">
        <h1>User {user.fullname}</h1>

        {!bugs && <h2>The user has no bugs</h2>}
        {bugs && <h3>Your bug list</h3>}
        <BugList bugs={bugs} />
    </section>
}