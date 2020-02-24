import React from 'react';
import {UserContext} from './context/UserContext';
import Signup from './components/Signup'
import Login from './components/Login'
import LogoutButton from './components/LogoutButton'
import Bundles from './components/Bundles'
import './App.css';

class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showSignUp: false, showLogin: false};
  }

  componentDidMount() {
    this.props.login();
  }  

  render() {
    const isLoggedIn = this.props.user != null;
    const userName = this.props.user ? this.props.user.username : '';

    const loginOptions = (
      <div>
        <div className='session-actions'>
          <span className={this.state.showLogin && 'active'} onClick={() => this.setState({showLogin: true, showSignUp: false})} >Login</span>
          <span className={this.state.showSignUp && 'active'} onClick={() => this.setState({showSignUp: true, showLogin: false})} >Sign Up</span>
        </div>          
        { this.state.showLogin && <Login login={() => this.props.login()}/> }
        { this.state.showSignUp && <Signup login={() => this.props.login()}/> }
      </div>
    )

    return (
      <div>
        <Greeting user={userName} />
        { isLoggedIn && <LogoutButton logout={() => this.props.logout()} />}
        { !isLoggedIn && loginOptions }
      </div>
    );
  }
}

function UserGreeting(props) {
  return <h1>Welcome back {props.name}!</h1>;
}

function Greeting(props) {
  if (props.user) {
    return <UserGreeting name={props.user}/>;
  }
  return <div/>;
}

class App extends React.Component {
  state = {};

  login = () => {
    let newState = this.state;
    let auth = window.localStorage.getItem('auth');
    let user = auth ? JSON.parse(auth) : null;
    newState.user = user;
    this.setState(newState);
  }

  logout = () => {
    window.localStorage.removeItem('auth');
    let newState = this.state;
    newState.user = null;
    this.setState(newState);
  }

  render() {
    return (
      <div className='App'>
        <UserContext.Provider value={{
          user: this.state.user,
          login: this.login,
          logout: this.logout
        }}>
          <UserContext.Consumer>
            {(context) => (
              <div>
                <LoginControl user={context.user} login={context.login} logout={context.logout}/>
                <Bundles user={context.user}/>
              </div>                
            )}
          </UserContext.Consumer>        
       </UserContext.Provider>
      </div>       
    );
  }
}

export default App;
