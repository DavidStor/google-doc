import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui/svg-icons/action/home'
import AddIcon from 'material-ui/svg-icons/content/add-circle'
import ListIcon from 'material-ui/svg-icons/editor/format-list-bulleted'
import JoinIcon from 'material-ui/svg-icons/content/link'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'
import TextField from 'material-ui/TextField'
import {indigo100} from 'material-ui/styles/colors'
import {Table, TableRow, TableBody, TableHeader, TableHeaderColumn, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton'
import {Document} from './Document';
import Dialog from 'material-ui/Dialog';


export default class DocumentList extends Component {
  state = {docs:[], tabValue: 2, open1: false, open2: false}

  loadDocuments = () => {
    this.props.socket.emit('getDocuments', {user: this.props.user}, (res) => {
      if(res.err) return alert('Error')
      this.setState({ docs: res.listDocs })
    })
  }

  refresh = (res) => {
    if(res.err){
    console.log(res.err);
      return alert('Error')
    }
    this.loadDocuments() //TODO: just update the state not a full reload
  }

  componentDidMount() {
    this.intervalHandle = setInterval(this.loadDocuments, 2000)
    this.loadDocuments()
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle)
  }

  onChange(field, e) {
    console.log('onchange', this.state)
    this.setState({
      [field]: e.target.value
    });
  }
  onCreate = () => {
    this.props.socket.emit('createDocument', {user: this.props.user , name: this.state.docName}, this.refresh);
    this.setState({docName: '', open1: false});
  }
  onJoin = () => {
    this.props.socket.emit('addDocumentCollaborator', {docId: this.state.docId, user: this.props.user}, this.refresh);
    this.setState({docId: '', open2: false});    
  }
  deleteDoc(docId) {this.props.socket.emit('deleteDocument', {docId}, this.refresh)}
  editDoc(doc) {
    this.props.socket.emit('loadDoc', {docId: doc._id }, (data) => {
      this.props.socket.emit('join', doc._id);
      this.props.app.setState({mode: 'editor', currentViewDock: data.document});
    });

}
  tabChange = (tabValue) => () => this.setState({ tabValue })
  logout() { this.props.app.setState({user: null})}
  handleOpen = () => {
  this.setState({open: true});
};

  render() {
    const {tabValue, docs} = this.state;
    const actions = [
      <RaisedButton label="Create" primary={true} keyboardFocused={true} onClick={this.onCreate}/>,
      <RaisedButton label="Cancel" onClick={() => this.setState({open1: false, docName: ''})}/>,
    ];
    const actions2 = [
      <RaisedButton label="Join" primary={true} keyboardFocused={true} onClick={() => this.onJoin()}/>,
      <RaisedButton label="Cancel" onClick={() => this.setState({open2: false, docId: ''})}/>,
    ];
    return (<div>
      <AppBar style={{backgroundColor: '#536DFE'}} title="Document Home" position="static" iconElementLeft={<IconButton><HomeIcon color={indigo100} /></IconButton>}>
        <IconButton onClick={() => this.setState({open1: true})} style={{marginTop: 8}}><AddIcon color={indigo100}/></IconButton>
        <IconButton onClick={() => this.setState({open2: true})} style={{marginTop: 8}}><JoinIcon color={indigo100}/></IconButton>
        <IconButton style={{marginTop: 8}}><ListIcon color={indigo100} /></IconButton>
        <IconButton onClick={() => this.logout()} style={{marginTop: 8}}><LogoutIcon color={indigo100} /></IconButton>
      </AppBar>

      <div>
        <Dialog
          title="Create Document"
          actions={actions}
          modal={false}
          open={this.state.open1}
          onRequestClose={() => this.setState({open1: false, docName: ''})}
        >
          <TextField floatingLabelText="Document Title" onChange={(e) => this.onChange('docName', e)} value={this.state.docName}/><br/>
        </Dialog>
      </div>

      <div>
        <Dialog
          title="Join Document"
          actions={actions2}
          modal={false}
          open={this.state.open2}
          onRequestClose={() => this.setState({open2: false, docId: ''})}
        >
          <TextField floatingLabelText="Document ID" onChange={(e) => this.onChange('docId', e)} value={this.state.docId}/><br/>
        </Dialog>
      </div>

      <div style={{padding:'20px'}}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Author</TableHeaderColumn>
              <TableHeaderColumn>Share key</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map(doc => {
              return (
                <TableRow key={doc._id}>
                  <TableRowColumn component="th" scope="row">
                    {doc.title}
                  </TableRowColumn>
                  <TableRowColumn component="th" scope="row">
                    {doc.author.username}
                  </TableRowColumn>
                  <TableRowColumn>{doc._id}</TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton onClick={() => this.editDoc(doc)}>Edit</RaisedButton>
                    <RaisedButton onClick={() => this.deleteDoc(doc._id)}>Delete</RaisedButton>
                  </TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

    </div>)
  }
}
