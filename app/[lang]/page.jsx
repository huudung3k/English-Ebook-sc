import "./globals.css"
import NavBar from "./component/navbar/NavBar"
import HomeBody from "./component/home/home-body/HomeBody"
import HomeHeader from "./component/home/home-header/HomeHeader"
import { filterUnits } from "../lib/unit"

const classId = '649956e65f8b51227d854748'

export default async function Home() {
  const units = JSON.parse(JSON.stringify(await filterUnits({ classId })))

  return (
    <div className="w-full h-full flex items-start justify-center bg-gray-200">
      <div id='home' className="home">
        <NavBar />
        <HomeHeader />
        <HomeBody units={units} />
      </div>
    </div>

  )
}
