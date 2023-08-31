"use client"

import { SessionProvider } from "next-auth/react"
import { createContext, useState } from "react";

export const AppContext = createContext()
export const NoteContext = createContext()

const initialState = {
    isHighlightMode: false,
    isNoteShown: false,
    readTextCallback: null,
    readMultipleTextsCallback: null,
    audio: null
}

export default function Providers({ children }) {

    const [appState, setAppState] = useState(initialState);
    const [noteState, setNoteState] = useState({ newNote: [] })

    return (
        <SessionProvider refetchOnWindowFocus={false}>
            <AppContext.Provider value={{ appState, setAppState }}>
                <NoteContext.Provider value={{ noteState, setNoteState }}>
                    {children}
                </NoteContext.Provider>
            </AppContext.Provider>
        </SessionProvider>
    )
};
