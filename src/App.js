import React from 'react';
import {UserContext} from './context/UserContext';
import AuthenticationControl from './components/AuthenticationControl'
import CreateBundleForm from './components/CreateBundleForm'
import Bundles from './pages/Bundles'
import Bundle from './pages/Bundle'
import User from './pages/User'
import FlashMessage from './components/FlashMessage'
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AppButtonBar from './AppButtonBar';

class LoginControl extends React.Component {
  componentDidMount() {
    this.props.login();
  }  

  render() {
    const isLoggedIn = this.props.user != null;
    const userName = this.props.user ? this.props.user.username : '';

    return (
      <div>
        { !isLoggedIn && <AuthenticationControl login={() => this.props.login()}/> }
      </div>
    );
  }
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
                <Router>
                  <LoginControl user={context.user} login={context.login} logout={context.logout}/>                
                  <Switch>
                    <Route exact path='/'>
                      { context.user &&
                        <div>
                          <Bundles user={context.user}/>                                              
                        </div>                          
                      }
                    </Route>
                    <Route exact path="/user">
                      <User user={context.user} logout={context.logout}/>
                    </Route>
                    <Route exact path="/create-bundle">
                      <CreateBundleForm user={context.user}/>
                    </Route>
                    <Route path="/bundle/:id" component={Bundle}/>} />
                  </Switch>
                  { context.user &&
                    <AppButtonBar/>
                  }
                </Router>                
              </div>                
            )}
          </UserContext.Consumer>        
       </UserContext.Provider>
       <FlashMessage/>
      </div>       
    );
  }
}

export default App;
