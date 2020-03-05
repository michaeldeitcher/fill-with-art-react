import React from "react";
import LogoutButton from '../components/LogoutButton'
import "./User.scss";

export default ({user, logout}) => {
    return (
        <div className='user-page'>
            <h2>{user.username}</h2>
            <p>version .02</p>
            <LogoutButton logout={() => logout()} />
        </div>
    );
}