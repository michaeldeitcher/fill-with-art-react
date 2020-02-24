import React from 'react'
import axios from 'axios'

export default class Bundles extends React.Component {
    state = {}

    render = () => {
        if(this.props.user) {
            const authorization_token = `Token token=${this.props.user.authentication_token}, email=${this.props.user.email}`;
            console.log(authorization_token);
            fetch('/bundles', { method: 'get', 
                                headers: { "Content-Type": "application/json",
                                            Authorization: authorization_token
                            }}).then(response => {
                                console.log(response);
                            });
                        }                                
        return (
            <div/>
        )
    }
}