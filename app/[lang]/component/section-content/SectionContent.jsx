"use client"

import "./section-content.css"
import { faCheck, faClockRotateLeft, faHeadphones } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import MatchWords from "../match-words/MatchWords"
import { useEffect, useRef, useState, useTransition } from "react"
import { Button, Loading } from "@nextui-org/react"
import { v4 as uuidv4 } from 'uuid';
import { insertCheckboxInput, insertRadioInput, insertTextArea, insertTextInput, splitLastOccurrence } from "../../../utils"
import { SASubmitAssignment, SAUpdateAssignment } from "../../actions/serverActions"
import { useSession } from "next-auth/react"
import Role from "../../../model/role"
import { usePathname } from "next/navigation"
import { i18n } from "../../../../i18n-config"

export default function SectionContent({ sectionData, assignmentsData, templateAnswer, readonly, randomId, hideSectionNumber, refechtTemplateAnswerCallback }) {
    const sectionRef = useRef(null)
    const [isPending, startTransition] = useTransition()
    const [assignments, setAssignments] = useState(null)
    const [isHistoryShown, setIsHistoryShown] = useState(false)
    const [draft, setDraft] = useState(null)
    const { data: session } = useSession()
    const [activeAssignment, setActiveAssignment] = useState(null)
    const pathname = usePathname()

    insertCheckboxInput(sectionData, randomId)
    insertTextArea(sectionData, randomId)
    insertTextInput(sectionData, randomId)
    insertRadioInput(sectionData, randomId)

    useEffect(() => {
        setAssignments(assignmentsData)
    }, [assignmentsData])

    useEffect(() => {
        setActiveAssignment(assignments?.find(a => a.isActive))
    }, [assignments])

    useEffect(() => {
        loadActive()
    }, [activeAssignment])

    useEffect(() => {
        const inputFields = sectionRef.current?.getElementsByTagName("input");
        if (inputFields) {
            for (const inputField of inputFields) {
                inputField?.addEventListener("change", saveDraft)
            }
        }

        if (draft) {
            loadDraft()
        }
        else if (activeAssignment) {
            loadActive()
        }

        return () => {
            const inputFields = sectionRef.current?.getElementsByTagName("input");
            if (inputFields) {
                for (const inputField of inputFields) {
                    inputField?.removeEventListener("change", saveDraft)
                }
            }

        }
    })

    const submit = () => {
        const answer = collectAnswer()
        const isTemplate = answer.isTemplate
        delete answer.isTemplate
        startTransition(async () => {
            const result = await SASubmitAssignment(session, sectionData._id, answer, isTemplate)
            if (result.isSucess) {
                const newAssignments = JSON.parse(JSON.stringify(assignments))
                newAssignments.push(result.data)
                setAssignments(newAssignments)
            } else {
                console.error(result.message);
            }
        })
    }

    const collectAnswer = () => {
        const answer = {}
        const inputFields = sectionRef.current?.getElementsByTagName("input")

        for (const inputField of inputFields) {
            const key = randomId ? splitLastOccurrence(inputField.name, '_')[0] : inputField.name
            if (inputField.type === 'radio' && inputField.checked) {
                answer[key] = inputField.value
            } else if (inputField.type === 'text') {
                answer[key] = inputField.value
            } else if (inputField.type === 'checkbox') {
                if (inputField.name === 'markAsTemplate') {
                    answer.isTemplate = inputField.checked

                }
                answer[key] = inputField.checked
            }
        }

        return answer
    }

    const loadAnswer = (answer, isDisabled, isTemplate) => {
        const inputFields = sectionRef.current.getElementsByTagName("input")

        for (let key in answer) {
            if (Object.hasOwnProperty.call(answer, key)) {
                const value = answer[key];
                const randomKey = key + (randomId ? '_' + randomId : '')
                for (const field of inputFields) {
                    if (field.name === randomKey) {
                        if (field.type === 'radio' && field.value === value) {
                            field.checked = true
                        } else if (field.type === 'text') {
                            field.value = value
                        } else if (field.type === 'checkbox') {
                            field.checked = value
                        }

                        if (templateAnswer) {
                            if (templateAnswer[key] !== value) {
                                field.style.color = '#E21D51'
                            } else {
                                field.style.color = '#1DE2AE'
                            }
                        }

                        if (isDisabled && !isTemplate) {
                            field.disabled = true
                        }
                    }

                    if (session?.user.role === Role.ADMIN && field.name === 'markAsTemplate') {
                        field.checked = isTemplate
                    }
                }
            }
        }
    }

    const saveDraft = () => {
        const answer = collectAnswer()
        setDraft(answer)
    }

    const loadDraft = () => {
        loadAnswer(draft, false, draft?.isTemplate)
    }

    const toggleAudio = (id) => {
        const audioElem = document.getElementById(id)
        if (audioElem.style.visibility === 'hidden') {
            audioElem.style.visibility = 'visible'
        }
        else {
            audioElem.pause()
            audioElem.style.visibility = 'hidden'
        }
    }

    const toggleHistory = () => {
        setIsHistoryShown(!isHistoryShown)
    }

    const loadActive = () => {
        const answer = activeAssignment?.answer
        loadAnswer(answer, true, activeAssignment?.isTemplate)
    }

    const updateActive = () => {
        const answer = collectAnswer()
        const isTemplate = answer.isTemplate
        delete answer.isTemplate
        startTransition(async () => {
            const result = await SAUpdateAssignment(session, { id: activeAssignment._id, sectionId: sectionData._id, answer, isTemplate })
            if (result.isSucess) {
                const index = assignments.findIndex(a => a.isActive)
                const newAssignments = JSON.parse(JSON.stringify(assignments))
                newAssignments[index] = result.data
                setAssignments(newAssignments)
            } else {
                console.error(result.message);
            }
        })

        if (i18n.locales.some(locale => pathname === (`/${locale}/admin`))) {
            refechtTemplateAnswerCallback()
        }
    }

    return (
        <div ref={sectionRef} className={`${sectionData.isTable ? "section-table" : ""} ${sectionData.isExercise ? "section-exercise" : ""} ${sectionData.isMatchWords ? "section-match-words" : ""} section`}>
            {sectionData.preTitle2 && <h2>{sectionData.preTitle2}</h2>}
            {sectionData.preTitle1 && <h3>{sectionData.preTitle1}</h3>}
            <h4>
                {!hideSectionNumber && <span>{sectionData.sectionNumber}</span>}
                {sectionData.hasAudio && <span className="audio-container" onClick={() => toggleAudio(sectionData._id)}><FontAwesomeIcon icon={faHeadphones} /></span>}
                {sectionData.title}
                {sectionData.hasAudio &&
                    <audio style={{ visibility: "hidden" }} id={sectionData._id} controls>
                        <source src={`/audio/${sectionData.audioFile}`} />
                    </audio>
                }
            </h4>

            <div className="history">
                {(sectionData.isExercise && assignments != null && !readonly) &&
                    <>
                        <FontAwesomeIcon className="history-icon" onClick={toggleHistory} icon={faClockRotateLeft} />
                        <div className={`records ${isHistoryShown ? 'show' : ''}`} >
                            {(assignments?.length === 0) ?
                                <p className="no-record">There is no record</p> :
                                <table>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Corrects</th>
                                            <th>Date</th>
                                            <th>Is active</th>
                                            <th>Is reviewed</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {assignments?.map((a, i) => {
                                            return (
                                                <tr key={uuidv4()}>
                                                    <td>{i + 1}</td>
                                                    <td>{a.numberOfCorrects ?? 0}</td>
                                                    <td>{new Date(a.createdAt).toDateString()}</td>
                                                    <td>{a.isActive ? <FontAwesomeIcon icon={faCheck} /> : ''}</td>
                                                    <td>{a.isFinished ? <FontAwesomeIcon icon={faCheck} /> : ''}</td>
                                                </tr>
                                            )
                                        })
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </>
                }
            </div>

            {sectionData.isMatchWords &&
                <MatchWords data={JSON.parse(sectionData.content || '""')} />
            }
            {!sectionData.isMatchWords &&
                <div className="section-content" dangerouslySetInnerHTML={{ __html: JSON.parse(sectionData.content || '""') }}></div>
            }
            <div className="btn-group">
                {(sectionData.isExercise && !readonly) &&
                    <>
                        {(assignments != null) &&
                            <>
                                {(session?.user.role === Role.ADMIN) &&
                                    <label>
                                        <input className="mx-1" type="checkbox" name="markAsTemplate" id="markAsTemplate" />
                                        Make as template
                                    </label>
                                }
                                {!activeAssignment &&
                                    <Button size="xs" type="button" onPress={submit}>{isPending ? <Loading /> : 'Submit'}</Button>

                                }
                                {(activeAssignment && session?.user.role === Role.ADMIN) &&
                                    <>
                                        <Button size="xs" type="button" onPress={loadActive}>{isPending ? <Loading /> : 'Load active record'}</Button>
                                        <Button size="xs" type="button" onPress={updateActive}>{isPending ? <Loading /> : 'Update active record'}</Button>
                                    </>
                                }
                            </>
                        }
                    </>
                }
            </div>
        </div>
    )
};
