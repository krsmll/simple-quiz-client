import { IQuestion } from "./IQuestion";
import { ISelectedOption } from "./ISelectedOption";

export interface IOption {
    id: string;
    questionId: string;
    question: IQuestion
    content: string;
    isCorrect: boolean
    selectedOptions: ISelectedOption[]
}
