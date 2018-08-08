import React from 'react';

class RegistrationForm extends React.Component {
  state = {
    login: '',
    password: '',
  };

  handleRegistration() {
    let {login, password} = this.state;
    this.props.socket.emit('register', {user: login, pass: password}, (result) => {
      console.log('register result:', result);
      if(result.err == null && result.user) {
        this.props.app.setState({user: result.user});
      }
    });
  };

  redirectLogin() {
    this.props.app.setState({mode: "login"});
  }

  render() {
    return (
      <div style={styles}>
        <input type="text" value={this.state.login} onChange={(e) => this.setState({login: e.target.value})} placeholder="Username"/>
        <input type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="Password"/>
        <button onClick={() => this.handleRegistration()}>Register</button>
        <button onClick={() => this.redirectLogin()}>Login</button>
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
