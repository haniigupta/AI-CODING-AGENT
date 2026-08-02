import {useRef, useState, useMemo, type RefObject} from "react";
import type {ScrollBarRenderable, ScrollBoxRenderable} from "@opentui/core";
import { useKeyboard } from "@opentui/core";
import { getFilteredCommands } from "./filter-cmds";
import { Command } from "./types";

type UseCommandMenuReturn = {
    showCommandMenu : boolean
    commandQuery : string;
    selectedIndex : number;
    scrollRef : RefObject<ScrollBarRenderable | null>;
    handleContentChange : (text : string) => void;
    resolveCommand : (index : number) => Command | undefined;
    setSelectedIndex : (index : number) => void;
}

export function useCommandMenu(): UseCommandMenuReturn {
    const [textValue, setTextValue] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showCommandMenu, setShowCommandMenu] = useState(false);
    const scrollRef = useRef<ScrollBoxRenderable>(null);

    const commandQuery = showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

    const filteredCommands = useMemo(() => getFilteredCommands(commandQuery), [commandQuery]);

    const handleContentChange = (text : string) => {
        setTextValue(text);
        setSelectedIndex(0);

        //jump back to the top of the list when user type new character
        const scrollbox = scrollRef.current;
        if(scrollbox){
            scrollbox.scrollTo(0);
        }

        const prefix = text.startsWith("/") ? text.slice(1) : null;
    }
}