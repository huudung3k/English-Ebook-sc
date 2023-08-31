import React, { Component } from "react";
import { getSelectedText } from "../utils";

class ReadableTextBlock extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.readingMode !== this.props.readingMode) return true
        return false
    }

    readSelectedText = async (e) => {
        if (e.button === 0) {
            if (this.props.readingMode) {
                const selectedText = getSelectedText()
                if (selectedText.length > 0) {
                    this.props.readCallback(selectedText)
                } else {
                    this.props.stopCallback()
                }
            }
        }

    }

    addNote = () => {
        const selectedText = getSelectedText()
        if (selectedText.length > 0) {
            this.props.addNoteCallback(selectedText)
        }
    }

    render() {
        return (
            <>
                <div
                    ref={this.props.pRef}
                    className="-m-2 px-6 py-4 text-justify border rounded-lg mt-2 bg-slate-100"
                    onMouseUp={this.readSelectedText}
                    onDoubleClick={this.addNote}
                >
                    <p className="text-lg" dangerouslySetInnerHTML={{ __html: this.props.text }}></p>
                </div>
            </>
        )
    }
};

export default React.forwardRef((props, ref) => <ReadableTextBlock pRef={ref} {...props} />)