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
    [key: string]: any;
};

export type DropdownPosition = {
    toTop: boolean;
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
