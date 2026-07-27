export type CommandContext = {
    exit : () => void
}

export type Command = {
    name : string;
    desciption: string;
    value: string;
    action? (ctx: CommandContext) => void | Promise<void>;
}