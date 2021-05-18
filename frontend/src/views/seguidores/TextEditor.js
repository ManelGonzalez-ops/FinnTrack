import React from "react";
import Draft from "draft-js";
import { Button, ButtonGroup, withStyles } from "@material-ui/core";
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
const { Editor, EditorState, RichUtils, getDefaultKeyBinding } = Draft;



export class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
        this.editor = React.createRef()
        this.focus = () => this.editor.current.focus();
        this.onChange = editorState => this.setState({ editorState });
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    }

    reply = () => {
        alert(this.state.editorState.getCurrentContent().getPlainText('\u0001'))
        const replyBody = this.state.editorState.getCurrentContent().getPlainText('\u0001')
        switch (this.props.type) {
            case "reply":
                this.props.handleReply(replyBody, this.props.parentId, this.props.ancestorId)
                return
            case "post":
                this.props.handleNewPost(replyBody, this.props.parentId)
                return
            default:
                return
        }
    }
    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }
    _mapKeyToEditorCommand(e) {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
                e,
                this.state.editorState,
                4 /* maxDepth */
            );
            if (newEditorState !== this.state.editorState) {
                this.onChange(newEditorState);
            }
            return;
        }
        return getDefaultKeyBinding(e);
    }
    _toggleBlockType(blockType) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }
    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
        );
    }
    render() {
        const { editorState } = this.state;
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = "RichEditor-editor";
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (
                contentState
                    .getBlockMap()
                    .first()
                    .getType() !== "unstyled"
            ) {
                className += " RichEditor-hidePlaceholder";
            }
        }
        return (
            <div className="RichEditor-root">
                <div className="RichEditor-editor" onClick={this.focus}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        keyBindingFn={this.mapKeyToEditorCommand}
                        onChange={this.onChange}
                        ref={this.editor}
                        spellCheck={true}
                    />
                </div>
                <div style={{ display: "flex" }}>
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={this.toggleInlineStyle}
                    />
                    <BlockStyleControls
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <Button onClick={this.reply}>Reply</Button>
                </div>
            </div>
        );
    }
}
// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    }
};
function getBlockStyle(block) {
    switch (block.getType()) {
        case "blockquote":
            return "RichEditor-blockquote";
        default:
            return null;
    }
}
const styles = {
    root: { minWidth: "40px" }
}
function PowererButton(props) {
    const { classes, children } = props
    return <Button classes={{ root: classes.root }} {...props}>
        {children}
    </Button>
}

const CustomButton = withStyles(styles)(PowererButton)
class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = e => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }
    render() {
        const { classes } = this.props
        let className = "RichEditor-styleButton";
        if (this.props.active) {
            className += " RichEditor-activeButton";
        }
        return (
            <CustomButton className={className} onClick={this.onToggle}

            >
                {this.props.label}
            </CustomButton>
        );
    }
}


const BLOCK_TYPES = [
    { label: "H1", style: "header-one" },
    { label: "H2", style: "header-two" },
    { label: "H3", style: "header-three" },
    { label: "H4", style: "header-four" },
    { label: "H5", style: "header-five" },
    { label: "H6", style: "header-six" },
    { label: <FormatQuoteIcon />, style: "blockquote" },
    { label: <FormatListNumberedIcon />, style: "unordered-list-item" },
    { label: <FormatListBulletedIcon />, style: "ordered-list-item" },

];
const BlockStyleControls = props => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">

            {BLOCK_TYPES.map((type, index) => (
                <StyleButton
                    key={index}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
};
var INLINE_STYLES = [
    { label: <FormatBoldIcon />, style: "BOLD" },
    { label: <FormatItalicIcon />, style: "ITALIC" },
    { label: <FormatUnderlinedIcon />, style: "UNDERLINE" },
];
const InlineStyleControls = props => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            <ButtonGroup size="small" aria-label="small outlined button group">
                {INLINE_STYLES.map((type, index) => (
                    <StyleButton
                        key={index}
                        active={currentStyle.has(type.style)}
                        label={type.label}
                        onToggle={props.onToggle}
                        style={type.style}
                    />
                ))}
            </ButtonGroup>
        </div>
    );
};
