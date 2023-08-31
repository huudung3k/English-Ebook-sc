import { useEffect, useCallback, useState } from "react";
import { getSelectedText } from "../../utils";
import { usePathname } from "next/navigation";
import { i18n } from "../../../i18n-config";

const initialContextMenuState = {
    show: false,
    x: 0,
    y: 0
}

const useContextMenu = (parentRef, menuRef) => {
    const [contextMenuState, setContextMenuState] = useState(initialContextMenuState);
    const [selectedText, setSelectedText] = useState('')
    const pathname = usePathname()

    const handleContextMenu = useCallback(
        (event) => {
            event.preventDefault();
            setContextMenuState({ show: true, x: event.pageX, y: event.pageY })
            setSelectedText(getSelectedText())
        },
        [setContextMenuState]
    );

    const handleClick = useCallback(() => contextMenuState.show && setContextMenuState(initialContextMenuState), [contextMenuState.show]);

    useEffect(() => {
        if (i18n.locales.some(locale => pathname.startsWith(`/${locale}/unit`))) {
            window.addEventListener("click", handleClick);
            if (parentRef.current) {
                parentRef.current.addEventListener("contextmenu", handleContextMenu);
            }
            return () => {
                window.removeEventListener("click", handleClick);
                if (parentRef.current) {
                    parentRef.current.removeEventListener("contextmenu", handleContextMenu);
                }
            };
        }
    });

    return { contextMenuState, selectedText };
};

export default useContextMenu;