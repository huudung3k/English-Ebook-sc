import { Alkatra, Bree_Serif, Ubuntu } from "next/font/google";
import localFont from "next/font/local"

export const alkatra = Alkatra(
    {
        subsets: ['latin'],
        variable: "--font-alkatra"
    }
)

export const breeSerif = Bree_Serif(
    {
        weight: ["400"],
        subsets: ["latin"],
        variable: "--font-bree-serif"
    }
)

export const ubuntu = Ubuntu(
    {
        weight: ["400", "700"],
        subsets: ["latin"],
        variable: "--font-ubuntu"
    }
)

export const sohoGothicProBold = localFont(
    {
        src: '../public/font/SohoGothicPro-Bold.ttf',
        variable: "--font-soho"
    }
)