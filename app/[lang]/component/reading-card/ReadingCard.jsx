"use client"
import Image from "next/image"
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHandPointer } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useRef } from "react";
import PlaybackBtnGroup from "../playback-btn-group/PlaybackBtnGroup";
import ReadableTextBlock from "../ReadableTextBlock";
import { ContextMenu } from "../context-menu/ContextMenu";
import Note from "../Note";
import { removeHtmlTags, textToSpeech } from "../../utils";
import { Loading } from "@nextui-org/react";
import "./reading-card.css"

export default function ReadingCard({ unit, topic, img, text }) {
    const [highlightMode, setHighlightMode] = React.useState(false)
    const [note, setNote] = React.useState([])
    const [audio, setAudio] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [duration, setDuration] = React.useState(0)
    const [multiTexts, setMultiTexts] = React.useState({ texts: [], currentIndex: -1 })
    const readableBlockRef = useRef()

    React.useEffect(() => {
        durationEffectCallback()
    }, [duration])

    const switchMode = () => {
        setHighlightMode(!highlightMode)
        stopAudio()
        setMultiTexts({ texts: [], currentIndex: -1 })
    }

    const addToNote = (text) => {
        text = text.toLowerCase()
        setNote([text, Math.random()])
    }

    const readText = async (text) => {
        stopAudio()
        setLoading(true)
        const blob = await textToSpeech(removeHtmlTags(text))
        const a = new Audio(URL.createObjectURL(blob));
        a.play();
        setAudio(a)
        setLoading(false)

        return a
    }

    const readMultiTextsTrigger = async (texts) => {
        stopAudio()
        const text = texts[multiTexts.currentIndex + 1];
        if (text) {
            setLoading(true)
            const blob = await textToSpeech(removeHtmlTags(texts[multiTexts.currentIndex + 1]))
            const a = new Audio(URL.createObjectURL(blob));
            a.addEventListener('loadedmetadata', () => {
                setDuration(a.duration)
            });
            setMultiTexts({ texts: texts, currentIndex: multiTexts.currentIndex + 1 })
            setAudio(a)
            setLoading(false)
        } else {
            setMultiTexts({ texts: [], currentIndex: -1 })
        }
    }

    const durationEffectCallback = async () => {
        if (audio) {
            audio.play();
        }

        for (let index = 0; index < (duration * 100 + 100); index++) {
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

    const pauseAudio = () => {
        if (audio) {
            audio.pause();
        }
    }

    const resumeAudio = () => {
        if (audio) {
            audio.play();
        }
    }

    return (
        <div>
            <Link className="text-4xl" href={'/'}><FontAwesomeIcon icon={faArrowLeft} /></Link>
            <div className="reading-card">
                <h1 className="text-3xl mb-4">Unit {unit}: <span>{topic.toUpperCase()}</span></h1>
                <div className="flex items-center justify-between w-full h-full mb-2">
                    <Image src={img} width={300} height={300} alt="Reading part image" className="mr-6" />
                    <Note
                        pNote={note}
                        readCallback={readText}
                        readMultiCallback={readMultiTextsTrigger}
                    />
                </div>
                <div className="btn-panel">
                    <button className={`text-2xl mr-4 my-2 ${highlightMode ? 'text-green-500' : 'text-[#f15a5a]'}`} onClick={switchMode}><FontAwesomeIcon icon={faHandPointer} /></button>
                    {!highlightMode && <PlaybackBtnGroup
                        text={text}
                        playCallback={readText}
                        stopCallback={stopAudio}
                        pauseCallback={pauseAudio}
                        resumeCallback={resumeAudio}
                        enabled={!highlightMode}
                        loading={loading}
                    />}
                    <div className="loading">
                        {loading && <Loading />}
                    </div>
                </div>

                <div className="w-full h-full">
                    <ReadableTextBlock
                        pRef={readableBlockRef}
                        text={text}
                        readingMode={highlightMode}
                        readCallback={readText}
                        stopCallback={stopAudio}
                        addNoteCallback={addToNote}
                    />
                </div>

                <ContextMenu parentRef={readableBlockRef} addToNote={addToNote} />
            </div>
        </div>
    )
};
