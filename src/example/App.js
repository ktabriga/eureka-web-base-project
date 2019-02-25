import React, { Component } from 'react';
import logo from './logo.svg';
import {Login, loginRoutes, RecoverPassword, PrivateRoute} from '../lib/Login'
import {Provider as ReduxProvider} from 'react-redux'
import store from './Store'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from './Home'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import AuthProvider from '../lib/Login/Auth'

const theme = createMuiTheme({ })

const apiFake = {
  login: credentials => Promise.resolve({ok: true, data: {token: 123, name: 'Jonh Doe'}}),
  setToken: (token) => apiFake.token = token
}

const LoginScreen = ({history}) => (
  <Login
    history={history}
    apiLogin={apiFake.login}
    requiredLabel='Obrigatório'
    usernameLabel='Usuário'
    passwordLabel='Senha'
    recoverPasswordLabel='Recuperar Senha'
    onLoginResponse={response => {
      apiFake.setToken(response.data.token)
      console.log(response.data)
    }}
    logo={<img alt='logo' src={logo}/>}/>
)

const RecoverPasswordScreen = ({history}) => (
  <RecoverPassword
    history={history}
    onBackClick={() => history.goBack()}
    onSubmit={values => {
      history.goBack()
      return Promise.resolve({ok: true})
    }}/>
)

class App extends Component {
  render() {
    return (
      <ReduxProvider store={store}>
        <AuthProvider withUser={user => apiFake.setToken(user.token)}>
          <MuiThemeProvider theme={theme}>
            <Router>
              <Switch>
                <Route path={loginRoutes.login} component={LoginScreen} />
                <Route path={loginRoutes.recoverPassword} component={RecoverPasswordScreen} />
                <PrivateRoute path='/' component={Home} />
              </Switch>
            </Router>
          </MuiThemeProvider>
        </AuthProvider>
      </ReduxProvider>
    );
  }
}

export default App;
