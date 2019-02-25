import React from 'react'
import PropTypes from 'prop-types'
import LoginForm from './LoginForm'
import {Redirect} from 'react-router-dom'
import {AuthContext} from './Auth'



class Login extends React.Component {
  static propTypes = {
    doLogin: PropTypes.func,
    onLoginResponse: PropTypes.func,
    apiLogin: PropTypes.func.isRequired,
    requiredLabel: PropTypes.string,
    redirectPath: PropTypes.string,
    loggedin: PropTypes.bool,
    recoverPasswordLabel: PropTypes.string
  }
  static contextType = AuthContext
  state = {
    errorMessage: ''
  }

  handleSubmit = async (credentials) => {
    const {onLoginResponse, apiLogin, formatData} = this.props
    const response = await apiLogin(credentials)
    onLoginResponse && onLoginResponse(response)
    if (response.ok) {
      if (!formatData || !formatData(response.data).name) {
        console.warn('Informe uma função formatData para o Login component que retorne um objecto com a propriedade "name"')
      }
      const userData = formatData ? formatData(response.data) : response.data
      return this.context.handleUserLogin(userData)
    }
    this.setState({
      errorMessage: 'Usuário ou senha inválidos'
    })

  }

  handleRecoverPasswordClick = () => {
    if (!this.props.history) {
      return console.warn('History not found. Try to pass password to login component')
    }
    this.props.history.push('/recover-password')
  }


  handleSanckbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      errorMessage: ''
    })
  }

  render() {
    const {
      screen: Screen,
      redirectPath,
      classes,
      ...rest
    } = this.props
    const {loggedin} = this.context

    if (Screen) {
      return (
        <Screen handleLogin={this.login} />
      )
    }

    if (loggedin) {
      return <Redirect to={'/' || redirectPath} />
    }

    return (
      <LoginForm
        {...rest}
        validate={this.validate}
        onPasswordRecoverLick={this.handleRecoverPasswordClick}
        errorMessage={this.state.errorMessage}
        requiredLabel={this.props.requiredLabel}
        onSubmit={this.handleSubmit}/>
    )
  }
}


export default Login
