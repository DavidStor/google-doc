import React, {Component, View} from 'react';
import Menu from 'material-ui/Menu';
import { Editor, EditorState, RichUtils } from 'draft-js';
import createStyles from 'draft-js-custom-styles';
import io from 'socket.io-client';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

class ToolbarExamplesSimple extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 3,
    };
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {
    return (
      <div>
      <Toolbar>
        <ToolbarGroup firstChild={true}>
          <DropDownMenu value={this.state.value} onChange={this.handleChange}>
            <MenuItem value={1} primaryText="All Broadcasts" />
            <MenuItem value={2} primaryText="All Voice" />
            <MenuItem value={3} primaryText="All Text" />
            <MenuItem value={4} primaryText="Complete Voice" />
            <MenuItem value={5} primaryText="Complete Text" />
            <MenuItem value={6} primaryText="Active Voice" />
            <MenuItem value={7} primaryText="Active Text" />
          </DropDownMenu>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle text="Options" />
          <FontIcon className="muidocs-icon-custom-sort" />
          <ToolbarSeparator />
          <RaisedButton label="Create Broadcast" primary={true} />
          <IconMenu
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationExpandMoreIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Download" />
            <MenuItem primaryText="More Info" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    </div>
    );
  }
}

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
const style = {
 customWidth: {
   width: 200,
 },
};

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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      show: false,
      value: 1
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
  _onSizeClick(e, size) {
    e.preventDefault()
    this.onChange(styles['fontSize'].toggle(this.state.editorState, size))
  }

  componentDidMount() {
    this.socket = io('http://localhost:1337');
    this.socket.on('connect', function(){console.log('ws connect')});
    this.socket.on('disconnect', function(){console.log('ws disconnect')});

    this.socket.emit('login', {user:'demi', pass:'demi'}, function(result){
      console.log('login result:', result);
    });
  }

  showMenu(e) {
    e.preventDefault();
    this.setState({show: true}, () => console.log(this.state.show));
  }

  handleChange(event, index, value){
    console.log(event, index, value)
    // this.setState({value: e.target.value});
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
        <RaisedButton label="Bold" primary={true} onMouseDown={(e) => this._onBoldClick(e)} primary={true}/>
        <RaisedButton label="Underline" primary={true} onMouseDown={(e) => this._onUClick(e)} primary={true}/>
        <RaisedButton label="Italics" primary={true} onMouseDown={(e) => this._onIClick(e)} primary={true}/>
        <RaisedButton label="Center" primary={true} onMouseDown={(e) => this._onCenterClick(e)} primary={true}/>
        <DropDownMenu value={this.state.value} onChange={(e, i, v) => this.handleChange(e, i, v)}>
          <MenuItem value={1} primaryText="10px"/>
          <MenuItem value={2} primaryText="12px"/>

          {/* {['10px','12px'].map((item, index) => <MenuItem value={index} primaryText={item}/>)} */}
        </DropDownMenu>
        <Editor
          editorState={this.state.editorState}
          customStyleMap={customStyleMap}
          customStyleFn={customStyleFn}
          blockStyleFn={getBlockStyle}
          onChange={this.onChange}
        />
      </ToolbarGroup>
      </Toolbar>

    );
  }
}
