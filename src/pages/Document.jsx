import React, {Component} from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui/svg-icons/action/home'
import SaveIcon from 'material-ui/svg-icons/content/save'
import ShareIcon from 'material-ui/svg-icons/social/share'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'
import createStyles from 'draft-js-custom-styles';
import io from 'socket.io-client';
import {indigo100} from 'material-ui/styles/colors'
import FontPicker from 'font-picker-react';
import Paper from 'material-ui/Paper';
import ContentReply from 'material-ui/svg-icons/action/exit-to-app';


/* Define custom styles */
const customStyleMap = {
  selection0: {
    borderLeft: 'solid 3px red',
    backgroundColor: 'rgba(255,0,0,.5)',
  },
  selection1: {
    borderLeft: 'solid 3px blue',
    backgroundColor: 'rgba(0,255,0,.5)',
  },
  selection2: {
    borderLeft: 'solid 20px green',
    backgroundColor: 'rgba(40,50,255,.5)',
    fontSize: '80px',
  },
};

/* Have draft-js-custom-styles build help functions for toggling font-size, color */
const {
  styles,
  customStyleFn,
} = createStyles(['font-size', 'color'], customStyleMap);

/* Let draft-js know what styles should be block vs inline
 * NOTE: This is needed, but RichUtils.toggleBlockType,
 *       RichUtils.toggleInlineStyle need to get called
 */
function isBlockStyle(style) {
  if (style.indexOf('text-align-') === 0) return true;
  return false;
}

function getBlockStyle(block) {
  const type = block.getType();
  return isBlockStyle(type) ? type : null;
}

/* list of button we need to render */

class Document extends React.Component {
  constructor(props) {
    super(props);
    // props.doc.content
    this.state = {
      editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.doc.content))),
      activeFont: 'Open Sans'
    };
    this.onChange = (editorState) => { this.setState({editorState})};
  }

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  _onUClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }
  _onIClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }
  _onCenterClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'text-align-center'));
  }

  _onRightClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'text-align-right'));
  }

  _onLeftClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'text-align-left'));
  }

  _onBulletListClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
  }

  _onNumberedListClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
  }



_onSaveClick(e){
  e.preventDefault();
  // let contentState = this.state.editorState.getCurrentContent();
  // let content = JSON.stringify(convertToRaw(contentState));
  // console.log("content:",  content);

  // this.socket.emit('saveDoc', {docId: this.state.document._id, content: content}, function(result){
  //   if (result.err == null && result.document){
     
  //     //this.setState({document: result.document}) // need to add a state variable
  //   }
  // })
}
//   _onGoHomeClick(e){
//     e.preventDefault(e)
//     // render document home page
//   }

  render() {
    return (
      <div style={{backgroundColor: "#eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center'}}>
        <AppBar style={{backgroundColor: '#536DFE'}} title="Document Home" position="static" iconElementLeft={<IconButton><HomeIcon color={indigo100} /></IconButton>}>
          <IconButton style={{marginTop: 8}}><SaveIcon color={indigo100}/></IconButton>
          <IconButton  style={{marginTop: 8}}><ShareIcon color={indigo100}/></IconButton>
          <IconButton onClick={() => this.logout()} style={{marginTop: 8}}><LogoutIcon color={indigo100} /></IconButton>
        </AppBar>
       <div>
         <button className='btn' onMouseDown={(e) => this._onSaveClick(e)}>Save</button>
         <button className='btn' onMouseDown={(e) => this._onGoHomeClick(e)}>Doc Home</button><br/>
         <button className="btn" onMouseDown={(e) => this._onBoldClick(e)}>Bold</button>
         <button className="btn" onMouseDown={(e) => this._onIClick(e)}>Italics</button>
         <button className="btn" onMouseDown={(e) => this._onUClick(e)}>Underline</button>
         <button className="btn" onMouseDown={(e) => this._onLeftClick(e)}>Left</button>
         <button className="btn" onMouseDown={(e) => this._onCenterClick(e)}>Center</button>
         <button className="btn" onMouseDown={(e) => this._onRightClick(e)}>Right</button>
         <button className="btn" onMouseDown={(e) => this._onBulletListClick(e)}>Bullet List</button>
         <button className="btn" onMouseDown={(e) => this._onNumberedListClick(e)}>Numbered List</button>
         <FontPicker
           apiKey="AIzaSyAEJbLvfLVpSM2CB66g_K4iOLjospEG_rY"
           activeFont={this.state.activeFont}
           onChange={nextFont => this.setState({ activeFont: nextFont.family })}
         />
         </div>
      <Paper style={{height: 842, width: 1000, margin: 40}} zDepth={2}>
        <div className="apply-font" style={{fontSize: 50}}>
          <Editor
            className="apply-font"
            editorState={this.state.editorState}
            customStyleMap={customStyleMap}
            customStyleFn={customStyleFn}
            blockStyleFn={getBlockStyle}
            onChange={this.onChange}
            />
          </div>
       </Paper>
     </div>
    );
  }
}

export default Document;
