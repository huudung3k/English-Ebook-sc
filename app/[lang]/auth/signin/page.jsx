"use client"

import "./sign-in.css"
import { redirect, useSearchParams } from "next/navigation"
import { Link, Image, Input, Button, Loading } from "@nextui-org/react";
import { useState, useTransition } from 'react'
import { signIn, useSession } from "next-auth/react"

const initialInputState = {
    status: 'default',
    helperColor: '',
    helperText: '',
    value: ''
}

export default function SignInPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const [usernameState, setUsernameState] = useState(initialInputState)
    const [passwordState, setPasswordState] = useState(initialInputState)
    const { status } = useSession()
    const [isPending, startTransition] = useTransition()

    if (status === 'authenticated') {
        redirect('/')
    }

    const submitForm = () => {
        const username = usernameState.value
        const password = passwordState.value

        if (username === "") {
            setUsernameState({ ...usernameState, status: "error", helperColor: "error", helperText: "Username is required" })
        }

        if (password === "") {
            setPasswordState({ ...passwordState, status: "error", helperColor: "error", helperText: "Password is required" })
        }

        if (username && password) {
            startTransition(async () => {
                await signIn("credentials", { username: username, password: password })
            })
        }
    }

    return (
        <div className="signin-page-container">
            <div className="signin">
                <div className="signin-form">
                    <div className="title-group">
                        <div className="title">Sign in</div>
                        <div className="sub-title">
                            Hey, Enter your details to login to your account
                        </div>
                    </div>

                    {(error === 'CredentialsSignin') &&
                        <div className="error">
                            <p>Username or password is incorrect</p>
                        </div>
                    }

                    <form action={submitForm} className="credential">
                        <Input
                            id="username"
                            className="input"
                            bordered color={usernameState.status}
                            status={usernameState.status}
                            helperColor={usernameState.helperColor}
                            helperText={usernameState.helperText}
                            onBlur={(e) => setUsernameState({ ...usernameState, value: e.target.value })}
                            onFocus={() => setUsernameState(initialInputState)}
                            fullWidth type="text"
                            labelLeft="Username"
                            aria-label="Username"
                            name="username"
                        />
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
                            labelLeft="Password"
                            aria-label="Password"
                            name="password"
                        />
                        <p className="signup-now">
                            Don&apos;t have an account yet?
                            <Link href="/auth/signup" className="link">Sign up now!</Link>
                        </p>

                        <Button type="submit" className="signin-btn" size='lg'>
                            {isPending ? <Loading color="currentColor" size="sm" /> : 'Sign in'}
                        </Button>
                    </form>
                </div>
                <div className="welcome">
                    <Image src="/images/welcome_cats.svg" alt="" />
                </div>
            </div>
        </div>
    )
};
