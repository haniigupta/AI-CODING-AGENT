import { StatusBar } from "./status-bar";

type Props = {
    onSubmit : (text: string) => void;
    disabled?: boolean;
}

export function InputBar({ onSubmit, disabled = false}: Props){
   return (
    <box width="100%" alignItems="center">
        <box
            // add left border
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
            <textarea 
              focused={!disabled}
              placeholder={`Ask anything..."Fix a bug in DB"`}
            />
            <StatusBar />
        </box>

        </box>
    </box>
   )
} 