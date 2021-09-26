import { IQuestion } from "./IQuestion";

export interface IQuiz {
    id: string;
    title: string;
    isPoll: boolean;
    questions: IQuestion[]
}
