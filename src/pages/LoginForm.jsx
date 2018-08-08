import React from 'react';

class LoginForm extends React.Component {
  state = {
    name: '',
    password: ''
  };

  handleLogin() {
    let {username, password} = this.state;
    console.log(username, password);
  };

  render() {
    return (
      <div style={styles}>
        <input type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} placeholder="Username"/>
        <input type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="Password"/>
        <button onClick={() => this.handleLogin()}>Login</button>
        <button onClick={() => this.props.redirectRegistration()}>Register</button>
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
