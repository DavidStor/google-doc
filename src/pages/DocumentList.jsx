import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui/svg-icons/action/home'
import AddIcon from 'material-ui/svg-icons/action/note-add'
import ListIcon from 'material-ui/svg-icons/action/list'
import JoinIcon from 'material-ui/svg-icons/action/backup'
import TextField from 'material-ui/TextField'
import {Table, TableRow, TableBody, TableHeader, TableHeaderColumn, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton'
import {Document} from './Document'

export default class DocumentList extends Component {
  state = {docs:[], tabValue: 2}

  loadDocuments = () => {
    this.props.socket.emit('getDocuments', {}, (res) => {
      if(res.err) return alert('Opps Error')
      this.setState({ docs: res.docs })
    })
  }

  refresh = (res) => {
    if(res.err) return alert('Opps Error')
    this.loadDocuments() //TODO: just update the state not a full reload
    this.setState({tabValue: 2})
  }

  componentDidMount() {
    this.intervalHandle = setInterval(this.loadDocuments, 2000)
    this.loadDocuments()
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle)
  }

  onChange = (field) => (e) => this.setState({[field]: e.target.value})
  onCreate = () => this.props.socket.emit('createDocument', {name: this.state.docName}, this.refresh)
  onJoin = () => this.props.socket.emit('addDocumentCollaborator', {docId: this.state.docId}, this.refresh)
  deleteDoc = (docId) => () => this.props.socket.emit('deleteDocument', {docId}, this.refresh)
  editDoc = (docId) => () => this.props.navigate(Document, {docId})
  tabChange = (tabValue) => () => this.setState({ tabValue })

  render() {
    const {tabValue, docs} = this.state
    return (<div>

      <AppBar title="All Documents" position="static" iconElementLeft={<IconButton><HomeIcon /></IconButton>}>
        <IconButton onClick={this.tabChange(0)} style={{marginTop: 8}}><AddIcon /></IconButton>
        <IconButton onClick={this.tabChange(1)} style={{marginTop: 8}}><JoinIcon /></IconButton>
        <IconButton onClick={this.tabChange(2)} style={{marginTop: 8}}><ListIcon /></IconButton>
      </AppBar>

      {tabValue === 0 && <div style={{padding:'20px'}}>
        <TextField floatingLabelText="Document Name" onChange={this.onChange('docName')} value={this.state.docName}/><br/>
        <RaisedButton color="primary" onClick={this.onCreate}>Create</RaisedButton>
      </div>}

      {tabValue === 1 && <div style={{padding:'20px'}}>
        <TextField floatingLabelText="Join Doc" onChange={this.onChange('docId')} value={this.state.docId}/><br/>
        <RaisedButton color="primary" onClick={this.onJoin}>Join</RaisedButton>
      </div>}

      {tabValue === 2 && <div style={{padding:'20px'}}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Share key</TableHeaderColumn>
                <TableHeaderColumn></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map(doc => {
                return (
                  <TableRow key={doc._id}>
                    <TableRowColumn component="th" scope="row">
                      {doc.name}
                    </TableRowColumn>
                    <TableRowColumn>{doc._id}</TableRowColumn>
                    <TableRowColumn>
                      <RaisedButton onClick={this.editDoc(doc._id)}>Edit</RaisedButton>
                      <RaisedButton onClick={this.deleteDoc(doc._id)}>Delete</RaisedButton>
                    </TableRowColumn>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
      </div>}

    </div>)
  }
}