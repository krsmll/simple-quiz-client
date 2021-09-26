import { IOption } from "./IOption";
import { IQuiz } from "./IQuiz";

export interface IQuestion {
    id: string;
    quizId: string;
    quiz: IQuiz
    content: string;
    options: IOption[]
}
