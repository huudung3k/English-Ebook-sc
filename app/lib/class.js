import Class from "../model/class"
import connectMongo from "./database";
import { ApiError } from "next/dist/server/api-utils";

let mongoose = null

export const createClass = async (name) => {
    if (!mongoose) mongoose = await connectMongo()

    const _class = await Class.findOne({ name: name })

    if (_class)
        throw new ApiError(400, `Class ${name} already exists`)

    const newClass = await Class.create({ name: name })

    delete newClass._doc.__v

    return newClass
}

export const getClass = async (id, includeDetail = false) => {
    if (!mongoose) mongoose = await connectMongo()

    let _class = null

    if (includeDetail) _class = await Class.findById(id, '-__v')
    else _class = await Class.findById(id, '_id')

    if (!_class) throw new ApiError(400, `Class with ID ${id} does not exist`)

    return _class
}

export const updateClass = async (id, name) => {
    if (!mongoose) mongoose = await connectMongo()

    const _class = await getClass(id, true)

    await Class.findByIdAndUpdate(id, { name: name ?? _class.name })

    const updatedClass = await Class.findById(id, '-__v')

    return updatedClass
}

export const deleteClass = async (id) => {
    if (!mongoose) mongoose = await connectMongo()

    await getClass(id)
    await Class.findByIdAndDelete(id)
}

export const filterClass = async () => {
    if (!mongoose) mongoose = await connectMongo()
    
    let classes = []

    classes = await Class.find({}, null, { sort: { name: 1 } })

    return classes
}