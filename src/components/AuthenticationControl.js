import React from 'react'
import ApiClient from '../utility/ApiClient'
import {emitFlashMessage} from './FlashMessage';

export default class AuthenticationControl extends React.Component {
    constructor(props) {
      super(props);
      this.state = {  isSignIn: true,
                      name: '', 
                      email: '', 
                      password: '',
                      nameError: '', 
                      emailError: '', 
                      passwordError: '',
                      pending: false 
                    };
  
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
      this.setState({pending: true});
      if(this.state.isSignIn)
        this.handleSignin();
      else
        this.handleSignup();
    }
  
    handleSignup() {
      fetch(ApiClient.apiRoot + '/users', 
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
        if( response.status === 422 ){
          this.handleError(response);
        }
        if( response.status === 201 ){
          emitFlashMessage("Sign up and signed in success!", "success");
          this.handleSuccess(response);
        }
      })
      .catch(function (error) {
        emitFlashMessage("Sorry something went wrong.", "error");
        console.error("Signup error:" + error);
      })
      .finally(()=>{this.setState({pending: false});});      
    }

    handleSignin() {
      fetch(ApiClient.apiRoot + '/users/sign_in', 
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
        if( response.status === 401 ) {
          emitFlashMessage("Signed in failure. Please check your email and password.", "error");
        }
        if( response.status === 201 ) {
          emitFlashMessage("Signed in success!", "success");
          this.handleSuccess(response);
        }
      })
      .catch(function (error) {
        emitFlashMessage("Sorry something went wrong.", "error");
        console.error("Signin error:" + error);
      })
      .finally(()=>{this.setState({pending: false});});      
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

    setSignIn(isSignIn) {
      this.setState({isSignIn: isSignIn, nameError: '', emailError: '', passwordError: ''});
    }
  
    render() {
      return (
        <div>
          <div>
            <div className='session-actions'>
              <span className={this.state.isSignIn ? 'active' : undefined} onClick={() => this.setSignIn(true)} >Sign In</span>
              <span className={this.state.isSignIn ? undefined : 'active'} onClick={() => this.setSignIn(false)} >Sign Up</span>
            </div>          
          </div>

          <form onSubmit={this.handleSubmit}>
            <div className='sign-up-container'>
              <div className={this.state.isSignIn ? 'animate-hide' : 'animate-show'}>
                <label>Name</label>
                <input type="text" value={this.state.value} onChange={(e) => this.handleChange('name', e)}/>
                { this.state.nameError.length > 0  && <div className='error-message'>{ this.state.nameError }</div> }
              </div>                
              <label>Email</label>
              <input type="email" value={this.state.value} onChange={(e) => this.handleChange('email', e)}/>
              { this.state.emailError.length > 0  && <div className='error-message'>{ this.state.emailError }</div> }              
              <label>Password</label>
              <input type="password" value={this.state.value} onChange={(e) => this.handleChange('password', e)}/>
              { this.state.passwordError.length > 0  && <div className='error-message'>{ this.state.passwordError }</div> }
              <input type="submit" className="submit" value={this.state.pending ? "Submitting" : "Submit"} />
            </div>
          </form>
        </div>          
      );
    }
  }