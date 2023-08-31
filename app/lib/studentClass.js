import StudentClass from "../model/studentClass"
import connectMongo from "./database";
import { removeNullValuesInObj } from "../utils"
import { ApiError } from "next/dist/server/api-utils";

let mongoose = null

export const createStudentClass = async ({name, year}) => {
    if (!mongoose) mongoose = await connectMongo()

    const studentClass = await StudentClass.findOne({ name, year })
    if (studentClass) throw new ApiError(400, `Student Class ${name} of year ${year} already exists`)

    const newClass = await StudentClass.create({
        name,
        year
    })
    delete newClass._doc.__v

    return newClass
}

export const getStudentClass = async (id, includeDetail = false) => {
    if (!mongoose) mongoose = await connectMongo()

    let studentClass = null

    if (includeDetail) studentClass = await StudentClass.findById(id, '-__v')
    else studentClass = await StudentClass.findById(id, '_id')

    if (!studentClass) throw new ApiError(400, `Student Class with ID ${id} does not exist`)

    return studentClass
}

export const updateStudentClass = async (id, name, year, isActive) => {
    if (!mongoose) mongoose = await connectMongo()

    const studentClass = await getStudentClass(id, true)
    const dupplicateClass = await StudentClass.findOne({ name: name ?? studentClass.name, year: year ?? studentClass.year})

    if (dupplicateClass) {
        throw new ApiError(400, `Student Class ${name} of year ${year} already exists`)
    }

    await StudentClass.findByIdAndUpdate(id, {
        name: name ?? studentClass.name,
        year: year ?? studentClass.year,
        isActive: isActive ?? studentClass.isActive
    })

    const updatedStudentClass = await StudentClass.findById(id, '-__v')

    return updatedStudentClass
};

export const deleteStudentClass = async (id) => {
    if (!mongoose) mongoose = await connectMongo()

    await getStudentClass(id)
    await StudentClass.findByIdAndDelete(id)
};

export const filterStudentClass = async ({name, year, isActive}) => {
    if (!mongoose) mongoose = await connectMongo()
    
    const filter = {
        name,
        year,
        isActive
    }
    removeNullValuesInObj(filter)

    const units = await StudentClass.find(filter, '-__v').sort({ name: 1 })

    return units
};
