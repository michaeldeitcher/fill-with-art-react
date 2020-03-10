import React from "react";
import LogoutButton from '../components/LogoutButton'
import "./User.scss";
import AppButtonBar from "../AppButtonBar"
import {Link} from "react-router-dom"
import { IoIosAddCircleOutline } from 'react-icons/io'


export default ({user, logout}) => {
    return (
        <div className='user-page'>
            <h2>{user.username}</h2>
            <p>version .02</p>
            <LogoutButton logout={() => logout()} />
            <AppButtonBar>
                <Link to="/create-bundle">
                    <li><IoIosAddCircleOutline/></li>
                </Link>
            </AppButtonBar>            
        </div>
    );
}