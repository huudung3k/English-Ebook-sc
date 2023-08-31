"use client"

import { Image } from "@nextui-org/react"
import "./home-header.css"

export default function HomeHeader() {
    return (
        <div id='home-header' className="home-header">
            <div className="left-content">
                <h1>read and add your insight</h1>
                <p>find your favorite book and read it here for free</p>
            </div>
            <div className="right-bg">
                <Image className="right-bg-overlay" src="/images/Saly-10.png" objectFit="contain"></Image>
            </div>
        </div>
    )
};
