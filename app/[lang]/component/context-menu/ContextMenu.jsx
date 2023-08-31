import React from "react";
import useContextMenu from "../../hooks/useContextMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import "./context-menu.css"

export default function ContextMenu({ parentRef, addToNote }) {
    const { contextMenuState, selectedText } = useContextMenu(parentRef)

    return (
        <>
            {contextMenuState.show &&
                <ul className="context-menu" style={{ top: contextMenuState.y, left: contextMenuState.x }}>
                    <li onClick={() => addToNote(selectedText)} className="context-menu-item">
                        <FontAwesomeIcon className="icon" icon={faNoteSticky} />
                        Add to Note
                    </li>
                </ul>}
        </>
    )
};
