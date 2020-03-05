import React from 'react';
import ApiClient from './utility/ApiClient'
import axios from 'axios';
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
  Route
} from "react-router-dom";
import AppButtonBar from './AppButtonBar';

class LoginControl extends React.Component {
  render() {
    const isLoggedIn = this.props.user != null;

    return (
      <div>
        { !isLoggedIn && <AuthenticationControl login={() => this.props.login()}/> }
      </div>
    );
  }
}

class App extends React.Component {
  state = {}
  componentDidMount() {
    this.anonymousToken();
    this.login();
  }  

  anonymousToken = () => {
    let newState = this.state;
    let anonymousToken = window.localStorage.getItem('anonymousToken');

    if(!anonymousToken) {
      axios.post( ApiClient.apiRoot + '/anonymous_tokens').then( (response) => {
        if( response.status === 201 ){
          anonymousToken = response.data.token;
          window.localStorage.setItem('anonymousToken', anonymousToken);
        }
      })
      .catch(function (error) {
          console.log("error: " + error);
      })   
    }

    newState.anonymousToken = anonymousToken;
    this.setState(newState);    
  }

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
          anonymousToken: this.state.anonymousToken,
          login: this.login,
          logout: this.logout
        }}>
          <UserContext.Consumer>
            {(context) => (
              <div>
                <Router>
                  <Switch>
                    <Route exact path='/'>
                      <LoginControl user={context.user} login={context.login} logout={context.logout} anonymousToken={this.anonymousToken}/>                                    
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
                      <CreateBundleForm user={context.user} anonymousToken={context.anonymousToken}/>
                    </Route>
                    <Route path="/bundle/:id" component={Bundle}/>} />
                    <Route path="/bundle/:id/:sectionId" component={Bundle}/>} />
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
