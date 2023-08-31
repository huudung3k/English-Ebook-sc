"use server"

import { createUser, getUser } from "../../lib/user";
import { createAssignment, filterAssignments, getAssignment, updateAssignment } from "../../lib/assignment"
import { createSection, filterSections, getSection, updateSection } from "../../lib/section";
import Role from "../../model/role";
import { countAssignments } from "../../lib/aggregrate";
import { createUnit, filterUnits, getUnit, updateUnit } from "../../lib/unit";
import { createPart, filterParts, getPart, updatePart } from "../../lib/part";
import { getDictionary } from "../../../get-dictionaries";

async function SATryCatchBlock(callback) {
    try {
        const data = await callback()
        return {
            isSucess: true,
            message: '',
            data
        }
    } catch (error) {
        return {
            isSucess: false,
            message: error.message
        }
    }
}

export async function SASignUp({ username, name, email, password, confirmPassword, studentClassId }) {
    try {
        await createUser({ username, name, email, password, confirmPassword, studentClassId })
        return {
            isSucess: true,
            message: ''
        }
    } catch (error) {
        return {
            isSucess: false,
            message: error.message
        }
    }
};

export async function SACreateUnit({ unitNumber, topic, summary, classId }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await createUnit({ unitNumber, topic, summary, classId }))) })
}

export async function SAUpdateUnit({ id, topic, summary }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await updateUnit({ id, topic, summary }))) })
}

export async function SAFilterUnits({ classId, skip, limit, ...fields }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await filterUnits({ classId, skip, limit, ...fields }))) })
}

export async function SACreatePart({ partNumber, title, unitId }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await createPart({ partNumber, title, unitId }))) })
}

export async function SAUpdatePart({ id, title }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await updatePart({ id, title }))) })
}

export async function SAFilterParts({ classId, unitId, sort, limit, ...fields }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await filterParts({ classId, unitId, sort, limit, ...fields }))) })
}

export async function SACreateSection({ partId, sectionNumber, title, content, preTitle1, preTitle2, hasAudio, isExercise, isTable, isMatchWords }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await createSection({ partId, sectionNumber, title, content, preTitle1, preTitle2, hasAudio, isExercise, isTable, isMatchWords }))) })
}

export async function SAGetSection({ id }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await getSection(id, true))) })
}

export async function SAUpdateSection({ id, title, content, preTitle1, preTitle2, hasAudio, audioFile, isExercise, isTable, isMatchWords }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await updateSection({ id, title, content, preTitle1, preTitle2, hasAudio, audioFile, isExercise, isTable, isMatchWords }))) })
}

export async function SAFilterSections({ classId, unitId, partId, sort, limit, ...fields }) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await filterSections({ classId, unitId, partId, sort, limit, ...fields }))) })
}

export async function SASubmitAssignment(session, sectionId, answer, isTemplate = false) {
    if (isTemplate) {
        if (session.user.role !== Role.ADMIN) {
            return {
                isSucess: false,
                message: "Admin privilege required"
            }
        }
    }

    return SATryCatchBlock(async function () { return await createAssignment({ userId: session.user.id, sectionId: sectionId, answer, isTemplate }) })
}

export async function SAGetAssignment(id) {
    return SATryCatchBlock(async function () { return JSON.parse(JSON.stringify(await getAssignment(id, true))) })
}

export async function SAUpdateAssignment(session, { id, sectionId, answer, numberOfCorrects, isActive, isFinished, isTemplate = false }) {
    if (isTemplate) {
        if (session.user.role !== Role.ADMIN) {
            return {
                isSucess: false,
                message: "Admin privilege required"
            }
        }
    }

    return SATryCatchBlock(async function () { return await updateAssignment({ id, answer, isTemplate, numberOfCorrects, isActive, isFinished }) })
}

export async function SAFilterAssignments({ studentClassId, userId, unitId, sectionId, isActive, isTemplate, isFinished, limit, skip, isTableData = false, lang = 'en' }) {

    async function localGetAssignment() {
        const dictionary = await getDictionary(lang);
        const assignments = JSON.parse(JSON.stringify(await filterAssignments({ studentClassId, userId, unitId, sectionId, isActive, isFinished, isTemplate, limit, skip })))

        if (isTableData) {
            const sectionMap = {}
            const partMap = {}
            const unitMap = {}
            const userMap = {}
            for (const assignment of assignments) {
                if (!sectionMap.hasOwnProperty(assignment.section)) {
                    const section = JSON.parse(JSON.stringify(await getSection(assignment.section, true)))
                    sectionMap[section._id] = { name: section.sectionNumber, parent: section.part }
                    if (!partMap.hasOwnProperty(section.part)) {
                        const part = JSON.parse(JSON.stringify(await getPart(section.part, true)))
                        partMap[part._id] = { name: part.title, parent: part.unit }
                        if (!unitMap.hasOwnProperty(part.unit)) {
                            const unit = JSON.parse(JSON.stringify(await getUnit(part.unit, true)))
                            unitMap[unit._id] = { name: unit.unitNumber }
                        }
                    }
                }

                if (!userMap.hasOwnProperty(assignment.user)) {
                    const user = await getUser({ id: assignment.user }, true)
                    userMap[user._id] = user.name
                }

                assignment.sectionCode = `${dictionary.unit} ${unitMap[partMap[sectionMap[assignment.section].parent].parent].name} - ${partMap[sectionMap[assignment.section].parent].name} - ${dictionary.section} ${sectionMap[assignment.section].name}`
                assignment.ownerName = `${userMap[assignment.user]}`
                assignment.status = assignment.isFinished ? dictionary.finished : assignment.isActive ? dictionary.active : dictionary.rejected
            }
        }

        return assignments
    }

    return SATryCatchBlock(localGetAssignment)
}

export async function SABuildAssignmentsChartData({ studentClassId, unitId }) {
    const assignmentsData = await countAssignments({ studentClassId, unitId })

    const counts = assignmentsData.map(d => d.assignmentsCount)
    const categories = assignmentsData.map(d => d._id)

    const options = {
        // series: [{
        //     name: 'Number of active assignment',
        //     data: counts
        // }],
        chart: {
            // type: 'bar',
            // height: 350
            id: "chart"
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: categories,
        },
        fill: {
            opacity: 1
        },
        // plotOptions: {
        //     bar: {
        //         distributed: true
        //     }
        // }
    };

    return {
        height: 350,
        width: '100%',
        type: 'bar',
        series: [{
            name: 'Number of active assignment',
            data: counts
        }],
        options: options
    }
}

export async function SAGetLocaleDictionary(lang) {
    return await getDictionary(lang)
}