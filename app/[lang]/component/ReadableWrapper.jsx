"use client"

import { trackPromise } from "react-promise-tracker"
import { getSelectedText, removeHtmlTags, textToSpeech } from "../../utils"
import { useContext, useEffect, useState, useRef } from 'react'
import { usePathname } from "next/navigation"
import { AppContext, NoteContext } from "./providers/Providers"
import ContextMenu from "../component/context-menu/ContextMenu"
import { i18n } from "../../../i18n-config"

export default function ReadableWrapper({ children }) {
    const [audio, setAudio] = useState(null)
    const pathname = usePathname()
    const { noteState, setNoteState } = useContext(NoteContext);
    const { appState, setAppState } = useContext(AppContext);
    const [multiTexts, setMultiTexts] = useState({ texts: [], currentIndex: -1 })
    // track audio's duration change to simulate reading word by word.
    // duration is an array [audioDration, Math.random()] so that the useEffect is always called when the duration is change although
    // the audioDuration is similar.
    const [duration, setDuration] = useState([])
    const [selectedText, setSelectedText] = useState('')
    const bodyRef = useRef(null)

    useEffect(() => {
        setAppState({ ...appState, readTextCallback: readText, readMultipleTextsCallback: readMultiTextsTrigger })
    }, [])

    useEffect(() => {
        durationEffectCallback()
    }, [duration])

    useEffect(() => {
        readSelectedText()
    }, [selectedText])

    const setHighlightText = () => {
        const text = getSelectedText()
        if (text !== selectedText) {
            setSelectedText(text)
        } else {
            setSelectedText('')
        }
    }

    const readSelectedText = async () => {
        if (!i18n.locales.some(locale => pathname.startsWith(`/${locale}/unit`))) return
        if (!appState.isHighlightMode) return
        if (selectedText.length > 0) {
            readText(selectedText)
        } else {
            stopAudio()
        }
    }

    const readText = async (text) => {
        stopAudio()
        const blob = await trackPromise(textToSpeech(removeHtmlTags(text)))
        const a = new Audio(URL.createObjectURL(blob))
        a.play()
        setAudio(a)

        return a
    }

    const readMultiTextsTrigger = async (texts) => {
        stopAudio()
        const text = texts[multiTexts.currentIndex + 1];
        if (text) {
            const blob = await trackPromise(textToSpeech(removeHtmlTags(texts[multiTexts.currentIndex + 1])))
            const a = new Audio(URL.createObjectURL(blob));
            a.addEventListener('loadedmetadata', () => {
                setDuration([a.duration, Math.random()])
            });
            setMultiTexts({ texts: texts, currentIndex: multiTexts.currentIndex + 1 })
            setAudio(a)
        } else {
            setMultiTexts({ texts: [], currentIndex: -1 })
        }
    }

    const durationEffectCallback = async () => {
        if (audio) {
            audio.play();
        }

        for (let index = 0; index < (duration[0] * 100 + 100); index++) {
            await new Promise(resolve => setTimeout(resolve, 10))
        }

        if (multiTexts.currentIndex >= 0) {
            readMultiTextsTrigger(multiTexts.texts)
        }
    }

    const stopAudio = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    const addToNote = (text = '') => {
        if (!i18n.locales.some(locale => pathname.startsWith(`/${locale}/unit`))) return
        let selectedText = getSelectedText()
        if (text) selectedText = text
        if (selectedText.length > 0) {
            selectedText = selectedText.toLowerCase()
            setNoteState({ ...noteState, newNote: [selectedText, Math.random()] })
        }
    }

    return (
        <>
            <div className="w-full h-full flex items-start justify-center" ref={bodyRef} onMouseUp={setHighlightText} onDoubleClick={() => addToNote()}>{children}</div>
            <ContextMenu parentRef={bodyRef} addToNote={addToNote} />
        </>

    )
};
