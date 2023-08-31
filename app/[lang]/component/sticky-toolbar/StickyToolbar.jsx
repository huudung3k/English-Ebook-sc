"use client"

import "./sticky-toolbar.css";
import { faAnglesLeft, faAnglesRight, faBook, faBookmark, faICursor, faNoteSticky, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useState, useEffect, useContext } from 'react'
import Note from "../Note"
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from "../providers/Providers";
import { useSession } from "next-auth/react";
import { i18n } from "../../../../i18n-config";

const classID = '649956e65f8b51227d854748'

export default function StickyToolbar() {
    const [menuLevel, setMenuLevel] = useState(1)
    const pathname = usePathname()
    const [units, setUnits] = useState([])
    const parts = ['Getting Started', 'Language', 'Reading', 'Speaking', 'Listening', 'Writing', 'Culture', 'Looking Back', 'Project']
    const [note] = useState([])
    const { appState, setAppState } = useContext(AppContext);
    const currentUnitId = pathname.split('/')[3]
    const [isToolbarShown, setIsToolbarShown] = useState(true)
    const { data: session } = useSession()

    useEffect(() => {
        fetch('/api/unit/filter', { method: 'POST', body: JSON.stringify({ classId: classID }) })
            .then(res => res.json())
            .then(data => setUnits(data))
    }, [])

    const showNavMenu = () => {
        setMenuLevel(2)
    }

    const showUnitMenu = () => {
        setMenuLevel(3)
    }

    const showPartMenu = () => {
        setMenuLevel(4)
    }

    const toggleNote = () => {
        setAppState({ ...appState, isNoteShown: !appState.isNoteShown })
    }

    const toggleHighlightMode = () => {
        setAppState({ ...appState, isHighlightMode: !appState.isHighlightMode })
    }

    const toggleToolbar = () => {
        setIsToolbarShown(!isToolbarShown)
        if (menuLevel === 0) setMenuLevel(1)
        else setMenuLevel(0)
    }

    return (
        <>
            {
                (i18n.locales.some(locale => pathname.startsWith(`/${locale}/unit`))) &&
                <>
                    <div className={`sticky-toolbar-container ${isToolbarShown ? 'show-toolbar' : ''}`}>
                        <button onClick={toggleToolbar} aria-label="open toolbar" type="button" className="open-toolbar toggle-toolbar">
                            <FontAwesomeIcon icon={faAnglesLeft} />
                        </button>

                        <div className="sticky-toolbar">
                            <div className={`toolbar-items-group ${menuLevel === 1 ? 'show-group' : ''}`}>
                                <div onClick={showNavMenu} className="toolbar-item" aria-label="Navigate" data-tooltip="Navigate">
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </div>
                                {session &&
                                    <>
                                        <div className={`toolbar-item ${appState.isNoteShown ? 'selected' : ''}`} onClick={toggleNote} aria-label="Note" data-tooltip="Note">
                                            <FontAwesomeIcon icon={faNoteSticky} />
                                        </div>
                                        <div className={`toolbar-item ${appState.isHighlightMode ? 'selected' : ''}`} onClick={toggleHighlightMode} aria-label="Highlight mode" data-tooltip="Highlight mode">
                                            <FontAwesomeIcon icon={faICursor} />
                                        </div>
                                    </>
                                }

                            </div>
                            <div className={`toolbar-items-group ${menuLevel === 2 ? 'show-group' : ''}`}>
                                <div className="toolbar-item" onClick={showUnitMenu} aria-label="Units" data-tooltip="Units">
                                    <FontAwesomeIcon icon={faBook} />
                                </div>
                                <div className="toolbar-item" onClick={showPartMenu} aria-label="Parts" data-tooltip="Parts">
                                    <FontAwesomeIcon icon={faBookmark} />
                                </div>
                            </div>
                            <div className={`toolbar-items-group ${menuLevel === 3 ? 'show-group' : ''}`}>
                                {
                                    units.map(u => {
                                        return (
                                            <Link key={uuidv4()} className="toolbar-item" aria-label={`Unit ${u.unitNumber}`} data-tooltip={`Unit ${u.unitNumber}`} href={`/unit/${u._id}/getting-started`}>
                                                {`Unit ${u.unitNumber}`}
                                            </Link>
                                        )
                                    })
                                }
                            </div>

                            <div className={`toolbar-items-group ${menuLevel === 4 ? 'show-group' : ''}`}>
                                {
                                    parts.map((p) => {
                                        return (
                                            // <p key={uuidv4()}><Link href={`/unit/${currentUnitId}/${p.split(' ').join('-').toLowerCase()}`}>{p}</Link></p>
                                            <Link key={uuidv4()} aria-label={p} data-tooltip={p} className="toolbar-item" href={`/unit/${currentUnitId}/${p.split(' ').join('-').toLowerCase()}`}>
                                                {p}
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                            <button onClick={toggleToolbar} aria-label="close toolbar" type="button" className="close-toolbar toggle-toolbar">
                                <FontAwesomeIcon icon={faAnglesRight} />
                            </button>
                        </div>
                    </div>
                    {appState.isNoteShown &&
                        <div className="floating-note">
                            <Note pNote={note} />
                        </div>
                    }
                </>
            }
        </>
    )
};
