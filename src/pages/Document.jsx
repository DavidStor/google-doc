import React, {Component} from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui/svg-icons/action/home'
import SaveIcon from 'material-ui/svg-icons/content/save'
import ShareIcon from 'material-ui/svg-icons/social/share'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'
import BoldIcon from 'material-ui/svg-icons/editor/format-bold'
import ItalicIcon from 'material-ui/svg-icons/editor/format-italic'
import UnderlineIcon from 'material-ui/svg-icons/editor/format-underlined'
import LeftIcon from 'material-ui/svg-icons/editor/format-align-left'
import CenterIcon from 'material-ui/svg-icons/editor/format-align-center'
import RightIcon from 'material-ui/svg-icons/editor/format-align-right'
import BulletIcon from 'material-ui/svg-icons/editor/format-list-bulleted'
import NumberIcon from 'material-ui/svg-icons/editor/format-list-numbered'
import SizeIcon from 'material-ui/svg-icons/editor/format-size'
import ColorIcon from 'material-ui/svg-icons/editor/format-color-text'
import createStyles from 'draft-js-custom-styles';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import io from 'socket.io-client';
import {indigo900, indigo100} from 'material-ui/styles/colors'
import FontPicker from 'font-picker-react';
import Paper from 'material-ui/Paper';


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
      activeFont: 'Open Sans',
      showFondPop: false,
      showColor: false,
      anchorEl: null
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
  _onSizeClick(e, size) {
    e.preventDefault()
    this.onChange(styles['fontSize'].toggle(this.state.editorState, size))
  }
  handleClose = () => {
     this.setState({
       anchorEl: null,
     });
   };
   _onColorClick(e, color) {
     e.preventDefault()
    this.onChange(styles['color'].toggle(this.state.editorState, color))
   }
  _onSaveClick(e) {
    e.preventDefault();
    let contentState = this.state.editorState.getCurrentContent();
    let content = JSON.stringify(convertToRaw(contentState));
    this.props.socket.emit('saveDoc', {docId: this.props.doc._id, content: content}, function(result){
  })
}

_onHomeClick(e) {
  e.preventDefault();
  let contentState = this.state.editorState.getCurrentContent();
  let content = JSON.stringify(convertToRaw(contentState));
  this.props.socket.emit('saveDoc', {docId: this.props.doc._id, content: content}, function(result){
});
  this.props.app.setState({mode: 'docList'});
}
//   _onGoHomeClick(e){
//     e.preventDefault(e)
//     // render document home page
//   }

  render() {
    return (
      <div style={{backgroundColor: "#eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center'}}>
        <AppBar style={{backgroundColor: '#536DFE'}} title="Document Home" position="static" iconElementLeft={<IconButton>
          <HomeIcon color={indigo100} onClick={(e) => this._onHomeClick(e)} /></IconButton>}>
          <IconButton style={{marginTop: 8}}><SaveIcon onClick={(e) => this._onSaveClick(e)} color={indigo100}/></IconButton>
          <IconButton  style={{marginTop: 8}}><ShareIcon color={indigo100}/></IconButton>
          <IconButton onClick={() => this.logout()} style={{marginTop: 8}}><LogoutIcon color={indigo100} /></IconButton>
        </AppBar>
        <div style={{margin: 0, padding: 0}}>
           <IconButton style={{marginTop: 8}}><BoldIcon onClick={(e) => this._onBoldClick(e)} color={indigo900}/></IconButton>
           <IconButton style={{marginTop: 8}}><ItalicIcon onClick={(e) => this._onIClick(e)} color={indigo900}/></IconButton>
           <IconButton style={{marginTop: 8}}><UnderlineIcon onClick={(e) => this._onUClick(e)} color={indigo900}/></IconButton>
           <IconButton style={{marginTop: 8}}><LeftIcon onClick={(e) => this._onLeftClick(e)} color={indigo900}/></IconButton>
           <IconButton style={{marginTop: 8}}><CenterIcon onClick={(e) => this._onCenterClick(e)} color={indigo900}/></IconButton>
           <IconButton style={{marginTop: 8}}><RightIcon onClick={(e) => this._onRightClick(e)} color={indigo900}/></IconButton>
           <IconButton style={{marginTop: 8}}><BulletIcon onClick={(e) => this._onBulletListClick(e)} color={indigo900}/></IconButton>
           <IconButton style={{marginTop: 8}}><NumberIcon onClick={(e) => this._onNumberedListClick(e)} color={indigo900}/></IconButton>
           <IconButton style={{marginTop: 8}}><SizeIcon onMouseDown={(e) => {

               e.preventDefault();
               console.log(e.currentTarget);
               this.setState({showFondPop: true, fontMenuEl: e.currentTarget})
             }}
              color={indigo900}/></IconButton>
            <Popover
              open={this.state.showFondPop}
              anchorEl={this.state.fontMenuEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={() => this.setState({showFondPop: false})}
            >
             <Menu>
              <MenuItem primaryText="8" onMouseDown={(e) => this._onSizeClick(e, '11px')}/>
              <MenuItem primaryText="12" onMouseDown={(e) => this._onSizeClick(e, '16px')}/>
              <MenuItem primaryText="14" onMouseDown={(e) => this._onSizeClick(e, '19px')}/>
              <MenuItem primaryText="24" onMouseDown={(e) => this._onSizeClick(e, '32px')}/>
              <MenuItem primaryText="36" onMouseDown={(e) => this._onSizeClick(e, '48px')}/>
              <MenuItem primaryText="42" onMouseDown={(e) => this._onSizeClick(e, '60px')}/>
             </Menu>
             </Popover>
             <IconButton style={{marginTop: 8}}><ColorIcon onMouseDown={(e) => this.setState({
               anchorEl: e.currentTarget,
               showColor: true
             })}
             color={indigo900}/> </IconButton>
              <Popover
                open={this.state.showColor}
                anchorEl={this.state.anchorEl}
                // onClose={this.handleClose}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={() => this.setState({
                   showColor: false
                 })}>
                <Menu>
                <MenuItem primaryText="black" onMouseDown={(e) => this._onColorClick(e, 'black')}/>
                <MenuItem primaryText="red" onMouseDown={(e) => this._onColorClick(e, 'red')}/>
                <MenuItem primaryText="blue" onMouseDown={(e) => this._onColorClick(e, 'blue')}/>
                <MenuItem primaryText="green" onMouseDown={(e) => this._onColorClick(e, 'green')}/>
                </Menu>
              </Popover>
            <FontPicker
                apiKey="AIzaSyAEJbLvfLVpSM2CB66g_K4iOLjospEG_rY"
                activeFont={this.state.activeFont}
                onChange={nextFont => this.setState({ activeFont: nextFont.family })}
            />
         </div>
      <Paper style={{height: 850, width: 1000, margin: 20, padding: 40}} zDepth={2}>
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
