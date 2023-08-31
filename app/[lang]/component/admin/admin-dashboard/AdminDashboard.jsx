"use client"

import "./admin-dashboard.css"
import AppTable from "../../app-table/AppTable";
import { useState, useRef } from "react"
import { SAFilterAssignments, SAGetAssignment, SAGetSection, SAUpdateAssignment } from "../../../actions/serverActions";
import SectionContent from "../../section-content/SectionContent";
import { countObjectSimilarities, toCamelCase } from "../../../../utils";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";


export default function AdminDashboard({ assignments, assignmentFilters, dictionary, lang }) {
    const [displayedAssignment, setDisplayedAssignment] = useState(null)
    const [displayedSection, setDisplayedSection] = useState(null)
    const [templateAssignment, setTemplateAssignment] = useState(null)
    const [tableItems, setTableItems] = useState(assignments)
    const [actionMessage, setActionMessage] = useState('')
    const { data: session } = useSession()
    const scoreRef = useRef(null)

    const defaultItems = assignments
    const columns = [
        {
            key: "ownerName",
            label: dictionary['student-name'],
        },
        {
            key: "sectionCode",
            label: dictionary.section,
        },
        {
            key: "status",
            label: dictionary.status,
        },
        {
            key: "createdAt",
            label: dictionary.date
        },
    ];

    const refechtTemplateAnswer = async () => {
        const result = await SAGetAssignment(templateAssignment?._id)
        if (result.isSucess) {
            setTemplateAssignment(result.data)
        } else {
            console.error(result.message);
        }
    }


    const getItem = async (id) => {
        setActionMessage('')
        const resultAssignment = await SAGetAssignment(id)

        if (resultAssignment.isSucess) {
            setDisplayedAssignment(resultAssignment.data)

            const resultSection = await SAGetSection({ id: resultAssignment.data.section })

            if (resultSection.isSucess) {
                setDisplayedSection(resultSection.data)
            } else {
                console.error(resultSection.message);
            }

            const resultTemplate = await SAFilterAssignments({ sectionId: resultSection.data._id, isTemplate: true, limit: 1 })

            if (resultTemplate.isSucess) {
                setTemplateAssignment(resultTemplate.data[0])
            } else {
                console.error(resultTemplate.message);
            }
        } else {
            console.error(resultAssignment.message);
        }
    }

    const applyFilters = async (filters) => {
        const studentClassId = filters.find(f => f.filterFor === 'class').key
        const unitId = filters.find(f => f.filterFor === 'unit').key
        const isActive = filters.find(f => f.filterFor === 'status').key === 'active' ? true : filters.find(f => f.filterFor === 'status').key === 'rejected' ? false : null
        const isFinished = filters.find(f => f.filterFor === 'status').key === 'finished'

        const result = await SAFilterAssignments({ isTemplate: false, studentClassId, unitId, isActive, isFinished, isTableData: true, lang: lang })

        if (result.isSucess) {
            setTableItems(result.data)
        } else {
            console.error(result.message);
        }

    }

    const clearFilters = () => {
        setTableItems(defaultItems)
    }

    const confirmScore = async () => {
        setActionMessage('')
        const score = scoreRef.current.value
        const result = await SAUpdateAssignment(session, { id: displayedAssignment._id, numberOfCorrects: score, isFinished: true })
        if (!result.isSucess) {
            console.error(result.message);
        } else {
            setActionMessage('Accepted')
        }

        const newAssignmentsResult = await SAFilterAssignments({ isTemplate: false, isActive: true, isFinished: false, isTableData: true })
        if (newAssignmentsResult.isSucess) {
            setTableItems(newAssignmentsResult.data)
        } else {
            console.error(newAssignmentsResult.message);
        }
    }

    const rejectAssignment = async () => {
        setActionMessage('')
        const result = await SAUpdateAssignment(session, { id: displayedAssignment._id, isActive: false, isFinished: false })
        if (!result.isSucess) {
            console.error(result.message)
        } else {
            setActionMessage('Rejected')
        }

        const newAssignmentsResult = await SAFilterAssignments({ isTemplate: false, isActive: true, isFinished: false, isTableData: true })
        if (newAssignmentsResult.isSucess) {
            setTableItems(newAssignmentsResult.data)
        } else {
            console.error(newAssignmentsResult.message);
        }
    }

    return (
        <div className="content">
            <h1 className="title">{toCamelCase(dictionary.admin['latest-assignments'])}</h1>
            <div className="table-container">
                <AppTable columns={columns} items={tableItems} getItemCallback={getItem} filters={assignmentFilters} applyFiltersCallback={applyFilters} clearFiltersCallback={clearFilters} dictionary={dictionary} />
            </div>
            {(displayedSection && displayedAssignment) &&
                <div className="review-assignment-container">
                    <div className="review-assignment">
                        <div className="answer-container">
                            <h3>{dictionary.admin['student-answer']}</h3>
                            <SectionContent randomId={1} sectionData={JSON.parse(JSON.stringify(displayedSection))} readonly={true} assignmentsData={[displayedAssignment]} templateAnswer={templateAssignment?.answer} loadActiveData={true} />
                        </div>
                        <div className="answer-container">
                            {templateAssignment &&
                                <>
                                    <h3>{dictionary.admin['template-answer']}</h3>
                                    <SectionContent randomId={2} sectionData={JSON.parse(JSON.stringify(displayedSection))} readonly={false} assignmentsData={[templateAssignment]} loadActiveData={true} refechtTemplateAnswerCallback={refechtTemplateAnswer} />
                                </>
                            }
                            {!templateAssignment &&
                                <div className="template-remind">Please provide answer template for this section to have score preview</div>
                            }
                        </div>
                    </div>
                    <div className="score-group">
                        <div className="score">{dictionary.score} <input ref={scoreRef} type="text" defaultValue={templateAssignment ? countObjectSimilarities(displayedAssignment.answer, templateAssignment.answer) : ''} />{`/${Object.keys(displayedAssignment.answer).length}`}</div>
                        <Button disabled={actionMessage !== ''} onPress={confirmScore} shadow auto>{displayedAssignment.isFinished ? dictionary.admin['update-score'] : dictionary.admin['accept-answer']}</Button>
                        <Button disabled={actionMessage !== ''} onPress={rejectAssignment} shadow auto>{dictionary.admin['reject-anwser']}</Button>
                        <p>{actionMessage}</p>
                    </div>
                </div>
            }
        </div>
    )
};