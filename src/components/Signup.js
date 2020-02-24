import React from 'react'

export default class Signup extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: '', email: '', password: '', nameError: '', emailError: '', passwordError: '' };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(name, event) {
      let newState = this.state
      newState[name] = event.target.value;
      this.setState(newState);
    }
  
    handleSubmit(event) {
      event.preventDefault();
      fetch('/users', 
      { 
        method: 'POST',
        headers: {"Content-Type": "application/json"},        
        body: JSON.stringify({
          user: {
            username: this.state.name,
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
        let newState = this.state;
        newState.nameError = '';
        newState.emailError = '';
        newState.passwordError = '';
        if(data.errors.length) {
          data.errors.forEach( (error) => {
            if(error.source.pointer === "/data/attributes/username")
              newState.nameError = error.detail;
            if(error.source.pointer === "/data/attributes/email")
              newState.emailError = error.detail;
            if(error.source.pointer === "/data/attributes/password")
              newState.passwordError = error.detail;
          })
        }
        this.setState(newState);
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
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={(e) => this.handleChange('name', e)} />
            { this.state.nameError.length > 0  && <span>{ this.state.nameError }</span> }
          </label>
          <label>
            Email:
            <input type="email" value={this.state.value} onChange={(e) => this.handleChange('email', e)} />
            { this.state.emailError.length > 0  && <span>{ this.state.emailError }</span> }
          </label>
          <label>
            Password:
            <input type="password" value={this.state.value} onChange={(e) => this.handleChange('password', e)} />
            { this.state.passwordError.length > 0  && <span>{ this.state.passwordError }</span> }
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }