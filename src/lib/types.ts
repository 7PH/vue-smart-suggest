export type AcceptedInputType = HTMLTextAreaElement;

export type Trigger = {
    char: string;
    searchRegExp?: RegExp;
    whitespaceBefore?: boolean;
    insertSpaceAfter?: boolean;
    items: Item[];
};

export type Item = {
    searchMatch: string;
    value: string;
    triggers?: string[];
    [key: string]: unknown;
};

export type DropdownPosition = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export type ActiveTrigger = {
    trigger: Trigger;
    search: string;
    index: number;
};
