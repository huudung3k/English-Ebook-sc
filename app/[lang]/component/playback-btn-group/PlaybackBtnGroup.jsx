import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faPause } from "@fortawesome/free-solid-svg-icons";
import "./playback-btn-group.css"

export default function PlaybackBtnGroup({ text, playCallback, pauseCallback, stopCallback, resumeCallback, enabled, loading }) {
    const [reading, setReading] = React.useState(false);
    const [selectedBtn, setSelectedBtn] = React.useState('');
    const [audio, setAudio] = React.useState(null)

    const resetState = () => {
        setReading(false)
        setSelectedBtn('')
        if (audio) {
            audio.removeEventListener('ended', resetState)
        }
    }

    useEffect(() => {
        if (audio) {
            audio.addEventListener('ended', resetState);
        }

        return () => {
            if (audio) {
                audio.removeEventListener('ended', resetState)
            }
        }
    }, [audio])

    useEffect(() => {
        if (!enabled) {
            stop()
        }
    }, [enabled])

    const play = async () => {
        if(selectedBtn === 'play') return
        
        if (selectedBtn === 'pause') {
            setSelectedBtn('play')
            resumeCallback()
        }
        else {
            setReading(true)
            setSelectedBtn('play')
            const a = await playCallback(text)
            setAudio(a)
        }
    }

    const stop = () => {
        stopCallback()
        resetState()
    }

    const pause = () => {
        setSelectedBtn('pause')
        pauseCallback()
    }

    return (
        <div className="playback-container">
            <button
                className={`playback-btn ${selectedBtn === 'play' ? 'selected' : ''}`}
                onClick={play}
                type="button"
                value="Read"
                disabled={loading}
            >
                <FontAwesomeIcon icon={faPlay} />
            </button>
            <div>
                <button
                    className={`playback-btn`}
                    onClick={stop}
                    type="button"
                    value="Stop"
                    disabled={!reading || loading}
                >
                    <FontAwesomeIcon icon={faStop} />
                </button>
                <button
                    className={`playback-btn ${selectedBtn === 'pause' ? 'selected' : ''}`}
                    onClick={pause}
                    type="button"
                    value="Pause"
                    disabled={!reading || loading}
                >
                    <FontAwesomeIcon icon={faPause} />
                </button>
            </div>
        </div>
    )
};
