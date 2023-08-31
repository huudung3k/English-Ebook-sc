"use client"

import "./auth-button.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { Dropdown } from "@nextui-org/react";

export default function AuthButton() {
    const { data: session, status } = useSession()
    return (
        <div className="auth-btn-container">
            {status === 'authenticated' &&
                <>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <p className="hello-user">Hello, {session.user.name.split(" ").at(0)}</p>
                        </Dropdown.Trigger>
                        <Dropdown.Menu selectionMode="single" onSelectionChange={(keys) => (keys.values().next().value) === 'sign-out' ? signOut() : ''}>
                            <Dropdown.Item key="sign-out">
                                Sign out
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </>
            }
            {status !== 'authenticated' &&
                <div className="not-auth-group">
                    <button type="button" onClick={() => signIn()}>Sign in</button>
                </div>
            }
        </div>
    )
};
