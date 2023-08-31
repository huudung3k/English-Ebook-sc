import React, { useContext, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faTrash, faBars } from "@fortawesome/free-solid-svg-icons";
import { alkatra } from "../../fonts";
import { AppContext, NoteContext } from "./providers/Providers";
import InteractiveButton from "../component/interactive-button/InteractiveButton"

export default function Note({ }) {
    const [notes, setNotes] = React.useState([])
    const { noteState } = useContext(NoteContext);
    const { appState } = useContext(AppContext)
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    useEffect(() => {
        const note = noteState.newNote[0] || ''
        if (note.length > 0) {
            if (!notes.includes(note)) {
                setNotes([...notes, note])
                postNotes([...notes, note])
            }
            else {
                alert(`Word "${note}" is already in Note`)
            }
        }
    }, [noteState.newNote])

    useEffect(() => {
        getNotes()
    }, [])

    const postNotes = async (data) => {
        await fetch("/api/note", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notes: data }),
        })
    }

    const getNotes = async () => {
        const response = await fetch("/api/note", {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const { data } = await response.json()
        setNotes(data)
    }

    const removeNote = (note) => {
        const filteredNotes = notes.filter((n) => n !== note)
        setNotes(filteredNotes)
        postNotes(filteredNotes)
    }

    const removeAllNotes = () => {
        setNotes([])
        postNotes([])
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        const elm = document.getElementById("note-wrapper")
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elm.style.top = (elm.offsetTop - pos2) + "px";
        elm.style.left = (elm.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

    return (
        <div id="note-wrapper" className="note-wrapper">
            <img src="/images/note-paper-clip.png" alt="note paper clip" width={30} />
            <div className="note-container">
                <div className="note-header" onMouseDown={dragMouseDown}>
                    Notes
                </div>
                <div className="note-content">
                    {notes.map((n) =>
                        <p className={alkatra.variable} key={n}>
                            <FontAwesomeIcon onClick={() => appState.readTextCallback(n)} className="mr-2 cursor-pointer" icon={faVolumeHigh} />
                            {n}
                            <FontAwesomeIcon onClick={() => removeNote(n)} className="ml-auto cursor-pointer" icon={faTrash} />
                        </p>
                    )}
                </div>
                <div className="note-container-btn-group">
                    {/* <button onClick={() => appState.readMultipleTextsCallback(notes)} >Read all</button>
                <button onClick={removeAllNotes}>Remove all</button> */}
                    <InteractiveButton onClick={() => appState.readMultipleTextsCallback(notes)} text="Read all" />
                    <InteractiveButton onClick={removeAllNotes} text="Remove all" />
                </div>
            </div>
        </div>
    )
};
