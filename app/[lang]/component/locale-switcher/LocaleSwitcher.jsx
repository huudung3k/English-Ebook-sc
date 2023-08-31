'use client'

import "./locale-switcher.css"
import { usePathname, useRouter } from 'next/navigation'
import { i18n } from '../../../../i18n-config'
import { Dropdown } from '@nextui-org/react'
import { useEffect, useState } from 'react'

export default function LocaleSwitcher() {
    const pathName = usePathname()
    const router = useRouter()
    const [selectedLocale, setSelectedLocale] = useState()
    const [locales, setLocales] = useState()

    useEffect(() => {
        const locales = i18n.locales.map(locale => ({
            key: locale,
            label: locale
        }))
        console.log(locales);
        setLocales(locales)
    }, [])

    useEffect(() => {
        const segments = pathName.split('/')
        const locale = i18n.locales.find(locale => locale === segments[1])

        setSelectedLocale(new Set([locale]))
    }, [pathName])


    const redirectedPathName = (locale) => {
        if (!pathName) return '/'
        const segments = pathName.split('/')
        segments[1] = locale
        return segments.join('/')
    }

    const onLocaleChange = (locale) => {
        setSelectedLocale(locale)
        router.push(redirectedPathName(locale.values().next().value))
    }

    return (
        <div>
            <Dropdown>
                <Dropdown.Button flat>
                    <div className='option'>
                        <img src={`/icons/${selectedLocale?.values().next().value}-flag.png`} alt="locale flag" width={20} height={20} />
                        {selectedLocale}
                    </div>
                </Dropdown.Button>
                <Dropdown.Menu
                    aria-label="Select Locale"
                    items={locales}
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selectedLocale}
                    onSelectionChange={onLocaleChange}
                >
                    {(item) => (
                        <Dropdown.Item
                            className='option'
                            key={item.key}
                        >
                            <img src={`/icons/${item.key}-flag.png`} alt="locale flag" width={20} height={20} />
                            <p>{item.label}</p>
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}