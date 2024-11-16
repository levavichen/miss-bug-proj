export function UserPreview({ user, onRemoveUser }) {

    return (
        <article>
            <h4>User Name: {user.username}</h4>
            <h4>User Fullname: {user.fullname}</h4>
            <h4>User Name: {user.username}</h4>
            <button onClick={() => onRemoveUser(user._id)}>Delete user</button>
        </article>
    )
}