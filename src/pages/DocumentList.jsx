import React from 'react';

class DocumentList extends React.Component {

  render() {
    return (
      <div style={styles}>
        <p>Here are all your documents {this.props.user.username}</p>
        <ul>
          {this.props.user.documents.map((document) => (<li>{document.title} {document.author}</li>))}
        </ul>
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
export default DocumentList;
