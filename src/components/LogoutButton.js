import React from 'react'

export default class LogoutButton extends React.Component {
    render(){
        return (
            <button onClick={ () => this.props.logout() }>
                Logout
            </button>            
        );
    }
}