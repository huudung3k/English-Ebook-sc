"use client"

import "./navbar.css"
import { Image, Link } from "@nextui-org/react"
import AuthButton from "../auth-button/AuthButton"
import { useEffect } from 'react'
import { useSession } from "next-auth/react"
import Role from "../../../model/role"

export default function NavBar() {
    const { data: session } = useSession()

    useEffect(() => {
        document.addEventListener('scroll', changeBackgroundOnScroll)

        return () => {
            document.removeEventListener('scroll', changeBackgroundOnScroll)
        }
    })

    const changeBackgroundOnScroll = () => {
        const navBar = document.getElementById('nav-bar')
        if (window.scrollY > 150) {
            navBar.classList.add('scrolled')
        } else {
            navBar.classList.remove('scrolled')
        }
    }

    return (
        <div id='nav-bar' className="nav-bar">
            <div className="logo">
                <Image src="/images/logo.png" alt="logo" />
            </div>
            <div className="nav">
                <Link className="link" href="#">About</Link>
                {session?.user.role === Role.ADMIN && <Link className="link" href="/admin">Admin</Link>}
                <div className="auth-btn">
                    <AuthButton />
                </div>
            </div>
        </div>
    )
};
