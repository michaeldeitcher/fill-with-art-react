import React from 'react'
import {useHistory} from "react-router-dom";
import {emitFlashMessage} from './FlashMessage';

export default (props) => {
    let history = useHistory();

    const logout = () => {
        props.logout(); 
        emitFlashMessage("Logged out succesfully!", "success");
        history.push('/');
    };

    return (
        <button onClick={ () => {logout();} }>
            Logout
        </button>            
    );
}