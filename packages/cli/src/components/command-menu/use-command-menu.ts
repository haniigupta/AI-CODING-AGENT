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
        if(prefix !== null && prefix.includes(" ")){
            setShowCommandMenu(true);
        } else {
            setShowCommandMenu(false);
        }
    }

    // resolve a cmd (return cmd, caller handles execution)
    const resolveCommand = (index : number) : Command | undefined => {
        const command = filteredCommands[index];
        if(command){
            setShowCommandMenu(false);
        }
        return command;
    }
    // arrow key movement
    useKeyboard((key) => {
        if(!showCommandMenu){
            return;
        }
        if(key.name === "escape"){
            setShowCommandMenu(false);
        } else if(key.name === "up"){
            key.preventDefault();
            setSelectedIndex((i : number) => {
                const newIndex = Math.max(0, i - 1);
                // keep the selected item in view
                const scrollbox = scrollRef.current;
                if(scrollbox && newIndex < scrollbox.scrollTop){
                    scrollbox.scrollTo(newIndex);
                }
                return newIndex;
            })
        } else if(key.name === "down"){
            key.preventDefault();
            setSelectedIndex((i : number) => {
                if(filteredCommands.length === 0){
                    return 0;
                }
                const newIndex = Math.min(filteredCommands.length - 1, i + 1);
                // keep the selected item in view
                const scrollbox = scrollRef.current;
                if(scrollbox){
                    const viewportHeight = scrollbox.viewport.height;
                    const visibleEnd = scrollbox.scrollTop + viewportHeight -1;
                    if(newIndex > visibleEnd){
                        scrollbox.scrollTo(newIndex - viewportHeight + 1);
                    }
                }
                return newIndex;
            })
        }
    })

    return {
        showCommandMenu,
        commandQuery,
        selectedIndex,
        scrollRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex,
    }
}