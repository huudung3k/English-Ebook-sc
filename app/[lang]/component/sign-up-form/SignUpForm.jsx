"use client"

import "./sign-up-form.css"
import { Image, Input, Link, Loading, Button, Dropdown } from "@nextui-org/react";
import { useState, useTransition, useMemo } from "react";
import { SASignUp } from '../../actions/serverActions'

const initialInputState = {
    status: 'default',
    helperColor: '',
    helperText: '',
    value: ''
}

export default function SignUpForm({ studentClasses }) {
    const [usernameState, setUsernameState] = useState(initialInputState)
    const [passwordState, setPasswordState] = useState(initialInputState)
    const [emailState, setEmailState] = useState(initialInputState)
    const [nameState, setNameState] = useState(initialInputState)
    const [confirmPasswordState, setConfirmPasswordState] = useState(initialInputState)
    const [selectedClass, setSelectedClass] = useState(new Set([studentClasses[0]._id]))
    const [errorMessage, setErrorMessage] = useState('')
    const [isSuccessful, setIsSuccessful] = useState(false)
    const [isPending, startTransition] = useTransition()

    const selectedClassName = useMemo(
        () => {
            return studentClasses.find(el => {
                const selectedClassId = Array.from(selectedClass).join(", ").replaceAll("_", " ");
                return el._id === selectedClassId
            })?.name
        },
        [selectedClass]
    );

    const submitForm = (formData) => {
        setErrorMessage('')
        setIsSuccessful(false)
        
        const username = formData.get('username')
        const password = formData.get('password')
        const email = formData.get('email')
        const name = formData.get('fullname')
        const confirmPassword = formData.get('confirm-password')
        const studentClassId = Array.from(selectedClass).join(", ").replaceAll("_", " ");

        if (username === "") {
            setUsernameState({ ...usernameState, status: "error", helperColor: "error", helperText: "Username is required" })
        }

        if (email === "") {
            setEmailState({ ...emailState, status: "error", helperColor: "error", helperText: "Email is required" })
        }

        if (name === "") {
            setNameState({ ...nameState, status: "error", helperColor: "error", helperText: "Full name is required" })
        }

        if (password === "") {
            setPasswordState({ ...passwordState, status: "error", helperColor: "error", helperText: "Password is required" })
        }

        if (confirmPassword === "") {
            setConfirmPasswordState({ ...confirmPasswordState, status: "error", helperColor: "error", helperText: "Confirm password is required" })
        }

        if (username && password && email && name && confirmPassword) {
            startTransition(async () => {
                const result = await SASignUp({ username, name, email, password, confirmPassword, studentClassId })
                if (result.isSucess) {
                    setIsSuccessful(true)
                } else {
                    setErrorMessage(result.message)
                }
            })
        }
    }

    return (
        <div className="signup">
            <div className="signup-img">
                <Image src="/images/sign_up.svg" alt="" />
            </div>
            <div className="signup-form">
                <div className="title-group">
                    <div className="title">Sign up</div>
                    <div className="sub-title">
                        Let&apos;s get started with your account
                    </div>
                </div>

                {errorMessage &&
                    <div className="error">
                        <p>{errorMessage}</p>
                    </div>
                }

                {isSuccessful &&
                    <div className="success">
                        <p>Sign up successfully. <Link className="link" href="/auth/signin">Sign in now!</Link></p>
                    </div>
                }

                <form action={submitForm} className="credential">
                    <Input
                        id="username"
                        className="input"
                        bordered
                        color={usernameState.status}
                        status={usernameState.status}
                        helperColor={usernameState.helperColor}
                        helperText={usernameState.helperText}
                        onBlur={(e) => setUsernameState({ ...usernameState, value: e.target.value })}
                        onFocus={() => setUsernameState(initialInputState)}
                        fullWidth type="text"
                        label="Username"
                        aria-label="Username"
                        name="username"
                    />
                    <Input
                        id="email"
                        className="input"
                        bordered
                        color={emailState.status}
                        status={emailState.status}
                        helperColor={emailState.helperColor}
                        helperText={emailState.helperText}
                        onBlur={(e) => setEmailState({ ...emailState, value: e.target.value })}
                        onFocus={() => setEmailState(initialInputState)}
                        fullWidth type="text"
                        label="Email"
                        aria-label="Email"
                        name="email"
                    />
                    <Input
                        id="fullname"
                        className="input"
                        bordered
                        color={nameState.status}
                        status={nameState.status}
                        helperColor={nameState.helperColor}
                        helperText={nameState.helperText}
                        onBlur={(e) => setNameState({ ...nameState, value: e.target.value })}
                        onFocus={() => setNameState(initialInputState)}
                        fullWidth type="text"
                        label="Full name"
                        aria-label="Full name"
                        name="fullname"
                    />
                    <Dropdown>
                        <Dropdown.Button size='lg' className="dropdown" light>Class {selectedClassName}</Dropdown.Button>
                        <Dropdown.Menu onSelectionChange={setSelectedClass} selectedKeys={selectedClass} aria-label="single selection class" items={studentClasses} selectionMode="single" disallowEmptySelection>
                            {(item) => (
                                <Dropdown.Item
                                    key={item._id}
                                >
                                    {item.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Input.Password
                        id="password"
                        className="input"
                        bordered
                        color={passwordState.status}
                        status={passwordState.status}
                        helperColor={passwordState.helperColor}
                        helperText={passwordState.helperText}
                        onBlur={(e) => setPasswordState({ ...passwordState, value: e.target.value })}
                        onFocus={() => setPasswordState(initialInputState)}
                        fullWidth
                        label="Password"
                        aria-label="Password"
                        name="password"
                    />
                    <Input.Password
                        id="confirm-password"
                        className="input"
                        bordered
                        color={confirmPasswordState.status}
                        status={confirmPasswordState.status}
                        helperColor={confirmPasswordState.helperColor}
                        helperText={confirmPasswordState.helperText}
                        onBlur={(e) => setConfirmPasswordState({ ...confirmPasswordState, value: e.target.value })}
                        onFocus={() => setConfirmPasswordState(initialInputState)}
                        fullWidth
                        label="Confirm your password"
                        aria-label="Confirm your password"
                        name="confirm-password"
                    />
                    <p className="signin-now">
                        Already have an account?
                        <Link className="link" href="/auth/signin">Sign in</Link>
                    </p>
                    <Button type="submit" className="signup-btn" size='lg'>
                        {isPending ? <Loading color="currentColor" size="sm" /> : 'Sign up'}
                    </Button>
                </form>
            </div>
        </div>
    )
};
