import {useRef, useCallback, useEffect} from "react"
import type { TextareaRenderable } from "@opentui/core";
import { useRenderer } from "@opentui/core";
import type { KeyBinding } from "@opentui/core";
import { StatusBar } from "./status-bar";
import {EmptyBorder} from "./border";
import { StatusBar } from "./status-bar";
import { CommandMenu } from "./command-menu";
import type { Command } from "./command-menu/types";
import type { useCommandMenu } from "./command-menu/use-command-menu";

type Props = {
    onSubmit : (text: string) => void;
    disabled?: boolean;
}

export const TEXTAREA_KEY_BINDINGS: KeyBinding[]=[
    { name : "return", action: "submit"},
    { name : "enter", action: "submit"},
     { name : "return",shift: true, action: "newline"},
     { name : "enter",shift: true, action: "newline"},
]

export function InputBar({ onSubmit, disabled = false}: Props){
    const textareaRef = useRef<TextareaRenderable>(null);
    const onSubmitRef = useRef<() => void>(() => {})
    const renderer = useRenderer();

    const {
        showCommandMenu,
        commandQuery,
        selectedIndex,
        scrollRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex,
    } = useCommandMenu();

    // wrap us textt area submit handler
    useEffect(() => {
        const textarea = textareaRef.current;
        if(!textarea){
            return;
        }

        textarea.onSubmit = () => {
            onSubmitRef.current();
        }
    }, []);

    onSubmitRef.current = () => {
        if (disabled) return;

        if(showCommandMenu){
            const command = resolveCommand(selectedIndex);
            handleCommand(command);
            return;
        }

        handleSubmit();
    };

   return (
    <box width="100%" alignItems="center">
        <box
            border ={["left"]}
            borderColor="cyan"
        >
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor="#1A1A24"
          width =  "100%"
          gap={1}
        >
            {true && (
                <box
                    position="absolute"
                    bottom="100%"
                    left={0}
                    width="100%"
                    backgroundColor="#1A1A24"
                    zIndex={10}
                >
                    <CommandMenu
                        query=""
                     />


                </box>

            )}
            <textarea 
              focused={!disabled}
              keyBindings={TEXTAREA_KEY_BINDINGS}
              placeholder={`Ask anything..."Fix a bug in DB"`}
            />
            <StatusBar />
        </box>

        </box>
    </box>
   )
} 