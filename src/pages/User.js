import React from "react";
import LogoutButton from '../components/LogoutButton'
import "./User.scss";

export default ({user, logout}) => {
    return (
        <div className='user-page'>
            <h2>{user.username}</h2>
            <LogoutButton logout={() => logout()} />
        </div>
    );
}