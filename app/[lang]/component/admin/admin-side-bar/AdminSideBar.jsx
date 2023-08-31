"use client"

import "./admin-side-bar.css"
import { Graph, Document, People } from "react-iconly"
import { Button, Image } from "@nextui-org/react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { SAGetLocaleDictionary } from "../../../actions/serverActions"

const LocaleSwitcher = dynamic(() => import('../../locale-switcher/LocaleSwitcher'), { ssr: false })

export default function AdminSideBar({ lang }) {
    const [dictionary, setDictionary] = useState({})
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function localGetDictionary() {
            const dict = await SAGetLocaleDictionary(lang)
            console.log(dict);
            setDictionary(dict)
        }

        localGetDictionary()
    }, [lang])


    return (
        <div className={`side-bar ${isOpen ? 'open' : ''}`} >
            <div onClick={() => setIsOpen(true)} className="hamburger">
                <FontAwesomeIcon icon={faBars} />
            </div>
            <div onClick={() => setIsOpen(false)} className="overlay"></div>
            <div className="logo">
                <Image src="/images/logo.png" alt="logo" />
            </div>
            <Button onPress={() => router.push(`/${lang}/admin`)} ripple={false} ghost icon={<Graph set="bulk" primaryColor="#8a9096" />} className="menu-item" size='lg' auto>Dashboard</Button>
            <div className="main-menu menu">
                <div className="menu-header">Main Menu</div>
                <Button onPress={() => router.push(`/${lang}/admin/classes`)} ripple={false} ghost icon={<People set="bold" primaryColor="#8a9096" />} className="menu-item" size='lg' auto>{dictionary?.admin?.classes}</Button>
                <Button onPress={() => router.push(`/${lang}/admin/book-content`)} ripple={false} ghost icon={<Document set="bold" primaryColor="#8a9096" />} className="menu-item" size='lg' auto>{dictionary?.admin?.['book-content']}</Button>
            </div>
            <div className="locale">
                <LocaleSwitcher />
            </div>
        </div>
    )
};
