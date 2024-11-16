import { UserPreview } from '../cmps/UserPreview.jsx'

export function UserIndex({ users, onRemoveUser }) {
    console.log('hi')
    return (
        <ul className="user-index">
            {users.map((user) => (
                <UserPreview
                    key={user._id}
                    user={user}
                    onRemoveUser={onRemoveUser}
                />
            ))}
        </ul >
    )
}