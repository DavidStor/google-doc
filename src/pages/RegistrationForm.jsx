import React from 'react';

class RegistrationForm extends React.Component {
  state = {
    name: '',
    password: '',
    passwordConfirm: ''
  };

  handleRegister() {
    let {username, password, passwordConfirm} = this.state;
    console.log(username, password, passwordConfirm);
  };

  render() {
    return (
      <div style={styles}>
        <input type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} placeholder="Username"/>
        <input type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="Password"/>
        <input type="password" value={this.state.passwordConfirm} onChange={(e) => this.setState({passwordConfirm: e.target.value})} placeholder="Confirm password"/>
        <button onClick={() => this.handleRegistration()}>Register</button>
        <button onClick={() => this.props.redirectLogin()}>Login</button>
      </div>
    );
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

export default RegistrationForm;
