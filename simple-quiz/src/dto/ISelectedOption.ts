import { IOption } from "./IOption";

export interface ISelectedOption {
    id: string;
    appUserId: string;
    optionId: string;
    option: IOption;
}

export interface ISelectedOptionAdd {
    appUserId: string;
    optionId: string;
}
