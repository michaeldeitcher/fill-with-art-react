import React from 'react'

export default class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {email: '', password: '', isFailed: false };
    }
  
    handleChange(name, event) {
      let newState = this.state
      newState[name] = event.target.value;
      this.setState(newState);
    }
  
    handleSubmit(event) {
      event.preventDefault();
      fetch('/users/sign_in', 
      { 
        method: 'POST',
        headers: {"Content-Type": "application/json"},        
        body: JSON.stringify({
          user: {
            email: this.state.email,
            password: this.state.password
          }
        })
      })
      .then( (response) => {
        if( response.status === 422 )
          this.handleError(response);
        if( response.status === 201 )
          this.handleSuccess(response);
      })
      .catch(function (error) {
        console.log(error);
      });      
    }

    handleError( response ) {
      response.json().then( data => {
        console.log(data);
      });
    }

    handleSuccess( response ) {
      response.json().then( data => {
        let attr = data.data.attributes;
        window.localStorage.setItem('auth', JSON.stringify(attr));    
        this.props.login();    
      });
    }
  
    render() {
      return (
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <label>
            Email:
            <input type="email" value={this.state.value} onChange={(e) => this.handleChange('email', e)} />
          </label>
          <label>
            Password:
            <input type="password" value={this.state.value} onChange={(e) => this.handleChange('password', e)} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }