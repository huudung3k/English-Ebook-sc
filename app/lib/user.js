import User from "../model/user"
import connectMongo from "./database";
import { ApiError } from "next/dist/server/api-utils";
import { getStudentClass } from './studentClass'
import { removeNullValuesInObj } from "../utils";

const argon2 = require('argon2');

const usernameRegex = /^[a-z0-9_\.]{3,16}$/
const passwordRegex = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{10,16}$/
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

let mongoose = null

export const createUser = async ({ username, name, email, password, confirmPassword, studentClassId }) => {
    if (!mongoose) mongoose = await connectMongo()

    const user = await User.findOne({ username })

    if (user)
        throw new ApiError(400, `User ${username} already exists`)

    const userByEmail = await User.findOne({ email })

    if (userByEmail)
        throw new ApiError(400, `Email ${email} has been used`)

    const studentClass = await getStudentClass(studentClassId)

    if (!usernameRegex.test(username)) {
        throw new ApiError(
            400,
            "Username must contain lowercase characters or digits or special symbols (_ and .) with length from 3 to 16 characters"
        )
    }

    if (!emailRegex.test(email)) {
        throw new ApiError(
            400,
            "Invalid email address"
        )
    }

    if (!passwordRegex.test(password)) {
        throw new ApiError(
            400,
            "Password must not contain any whitespaces. Password must contain at least one uppercase character, one lowercase character, one digit. Password must be 10-16 characters long"
        )
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Password and repeat password are not match")
    }

    const hashedPassword = await argon2.hash(password)

    const newUser = await User.create({
        username,
        name,
        password: hashedPassword,
        email,
        studentClass
    })

    delete newUser._doc.password
    delete newUser._doc.__v

    return newUser
}

export const getUser = async ({ id, username }, includeDetail = false) => {
    if (!mongoose) mongoose = await connectMongo()

    let user = null

    if (id) {
        if (includeDetail) user = await User.findById(id, '-__v')
        else user = await User.findById(id, '_id')
    } else if (username) {
        if (includeDetail) user = await User.findOne({ username }, '-__v')
        else user = await User.findOne({ username }, '_id')
    }

    if (!user) throw new ApiError(400, `User with ${id !== undefined ? 'ID' : 'username'} ${id ?? username} does not exist`)

    return user
}

export const login = async (username, password) => {
    if (!mongoose) mongoose = await connectMongo()

    const user = await User.findOne({ username }, "-__v")

    if (user && (await argon2.verify(user.password, password))) {
        user.lastLoginAt = Date.now()
        user.save()
        return user
    }

    return null
}

export const filterUsers = async ({ studentClassId, skip = 0, limit = 20 }) => {
    if (!mongoose) mongoose = await connectMongo()

    let studentClass = null

    if (studentClassId) studentClass = await getStudentClass(studentClassId)

    const filter = {
        studentClass
    }
    removeNullValuesInObj(filter)

    const users = await User.find(filter, '-_v').sort({ username: 1 }).skip(skip).limit(limit)

    return users
}