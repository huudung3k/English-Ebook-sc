import Assignment from "../model/assignment"
import connectMongo from "./database";
import { removeNullValuesInObj } from "../utils"
import { ApiError } from "next/dist/server/api-utils";
import { filterUsers, getUser } from "../lib/user"
import { filterSections, getSection } from "../lib/section"
import Role from "../model/role";

let mongoose = null

export const createAssignment = async ({ userId, sectionId, answer, isTemplate }) => {
    if (!mongoose) mongoose = await connectMongo()

    const user = await getUser({ id: userId })
    const section = await getSection(sectionId)

    const activeAssignment = await Assignment.findOne({ user, section, isActive: true })
    if (activeAssignment) throw new ApiError(400, `There is an active assignment of user ${id} for section ${sectionId}`)

    const finishedAssignment = await Assignment.findOne({ user, section, isActive: true })
    if (finishedAssignment) throw new ApiError(400, `There is a finished assignment of user ${id} for section ${sectionId}`)

    const newAssignment = await Assignment.create({
        user,
        section,
        answer,
        isTemplate
    })
    delete newAssignment._doc.__v

    return newAssignment
}

export const getAssignment = async (id, includeDetail = false) => {
    if (!mongoose) mongoose = await connectMongo()

    let assignment = null

    if (includeDetail) assignment = await Assignment.findById(id, '-__v')
    else assignment = await Assignment.findById(id, '_id')

    if (!assignment) throw new ApiError(400, `Assignment with ID ${id} does not exist`)

    return assignment
}

export const updateAssignment = async ({ id, answer, isActive, isFinished, isTemplate, numberOfCorrects }) => {
    if (!mongoose) mongoose = await connectMongo()

    const assignment = await getAssignment(id, true)
    const user = await getUser({ id: assignment.user }, true)
    const section = await getSection(assignment.section)

    if (isTemplate) {
        if (user.role !== Role.ADMIN) {
            throw new ApiError(400, `Only record of admin can be set as a template`)
        }
        const templateAssignment = await Assignment.findOne({ section, isTemplate })
        if (!templateAssignment._id.equals(assignment._id)) {
            throw new ApiError(400, `There is an active template`)
        }
    }

    if (isActive != null) {
        if (!isActive && assignment.isFinished) {
            throw new ApiError(400, `Cannot change active state of a finished assignment`)
        }
        if (isActive && !assignment.isActive) {
            const activeAssignment = await Assignment.findOne({ user, section, isActive })
            if (activeAssignment) throw new ApiError(400, `There is an active assignment of user ${user._id} for section ${section._id}`)
        }
    }

    if (isFinished) {
        if (!assignment.isActive || (isActive === false)) {
            throw new ApiError(400, `Cannot not set a assignment finished if it is not active`)
        }

        if (!assignment.isFinished) {
            const finishedAssignment = await Assignment.findOne({ user, section, isFinished })
            if (finishedAssignment) throw new ApiError(400, `There is a finished assignment of ${user._id} for section ${section._id}`)
        }
    }

    await Assignment.findByIdAndUpdate(id, {
        answer: answer ?? assignment.answer,
        isFinished: isFinished ?? assignment.isFinished,
        isActive: isActive ?? assignment.isActive,
        isTemplate: isTemplate ?? assignment.isTemplate,
        numberOfCorrects: numberOfCorrects ?? assignment.numberOfCorrects
    })

    const updatedAssignment = await Assignment.findById(id, '-__v')

    return updatedAssignment
};

export const deleteAssignment = async (id) => {
    if (!mongoose) mongoose = await connectMongo()

    await getAssignment(id)
    await Assignment.findByIdAndDelete(id)
};

export const filterAssignments = async ({ studentClassId, userId, unitId, sectionId, isActive, isTemplate, isFinished, limit = 20, skip = 0 }) => {
    if (!mongoose) mongoose = await connectMongo()

    if (isFinished) isActive = true

    let filter = {
        isActive,
        isTemplate,
        isFinished
    }

    if (sectionId) {
        const section = await getSection(sectionId)
        filter = { ...filter, section }
    } else if (unitId) {
        const sections = await filterSections({ unitId })
        filter = { ...filter, section: { $in: sections } }
    }

    if (userId) {
        const user = await getUser({ id: userId })
        filter = { ...filter, user }
    } else if (studentClassId) {
        const users = await filterUsers({ studentClassId, limit: 100 })

        filter = { ...filter, user: { $in: users } }
    }

    removeNullValuesInObj(filter)

    const assignments = await Assignment.find(filter, '-__v').sort({ createdAt: 1 }).skip(skip).limit(limit)

    return assignments
};
