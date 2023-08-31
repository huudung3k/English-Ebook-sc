import './globals.css'
import { Inter } from 'next/font/google'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Providers from './component/providers/Providers';
import FetchLoadingSpinner from './component/FetchLoadingSpinner'
import StickyToolbar from "./component/sticky-toolbar/StickyToolbar"
import ReadableWrapper from "./component/ReadableWrapper"

// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'English book',
  description: 'English book',
}

export default function RootLayout({ children, params }) {
  return (
    <html lang={params.lang}>
      <body className={`${inter.className}`}>
        <Providers>
          <StickyToolbar />
          <FetchLoadingSpinner />
          <ReadableWrapper>
            {children}
          </ReadableWrapper>
        </Providers>
      </body>
    </html>
  )
}
