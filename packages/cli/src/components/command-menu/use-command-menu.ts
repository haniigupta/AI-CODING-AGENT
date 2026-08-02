import {useRef, useState, useMemo, type RefObject} from "react";
import type {ScrollBarRenderable} from "@opentui/core";
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