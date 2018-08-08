import React from 'react';

class LoginForm extends React.Component {
  state = {
    login: '',
    password: ''
  };

  handleLogin() {
    let {login, password} = this.state;
    this.props.socket.emit('login', {user: login, pass: password}, (result) => {
      console.log('login result:', result);
      if(result.err == null && result.user) {
        this.props.app.setState({user: result.user});
      }
    });
  };

  redirectRegistration() {
    this.props.app.setState({mode: "register"});
  }

  render() {
    return (
      <div style={styles}>
        <input type="text" value={this.state.login} onChange={(e) => this.setState({login: e.target.value})} placeholder="Username"/>
        <input type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="Password"/>
        <button onClick={() => this.handleLogin()}>Login</button>
        <button onClick={() => this.redirectRegistration()}>Register</button>
      </div>
    )
  }
}
const styles = {
  backgroundColor: "#eee",
  padding: 20,
  borderRadius: 10,
  width: 300,
  height: 200,
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
  }
export default LoginForm;
