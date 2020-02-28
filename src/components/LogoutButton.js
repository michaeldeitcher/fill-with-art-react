import React from 'react'
import {useHistory} from "react-router-dom";

export default (props) => {
    let history = useHistory();

    return (
        <button onClick={ () => {props.logout(); history.push('/');}}>
            Logout
        </button>            
    );
}