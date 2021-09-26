import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";

import { AppContext } from "../../context/AppContext";
import { IQuiz } from "../../dto/IQuiz";
import { IRouteId } from "../../types/IRouteId";
import { ISelectedOption, ISelectedOptionAdd } from "../../dto/ISelectedOption";

const QuizTaking = () => {
    const appState = useContext(AppContext);
    const history = useHistory();
    const { id } = useParams() as IRouteId;
    const [quiz, setQuiz] = useState({} as IQuiz)
    const [numbering, setNumbering] = useState([] as number[])
    const [selectedOptions, setSelectedOptions] = useState([] as ISelectedOptionAdd[])
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const loadData = async () => {
        let result = await BaseService.get<IQuiz>(id, '/quizzes', appState.token!);

        if (result.ok && result.data) {
            setQuiz(result.data)
            console.log(result.data);
            
            let arr: ISelectedOptionAdd[] = [];
            let nums: number[] = [];
            let i = 0;

            result.data.questions.forEach(q => {
                arr.push({
                    "appUserId": appState.userId,
                    "optionId": ''
                })
                nums.push(i++);
            })
            setSelectedOptions(arr)
            setNumbering(nums);
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: 404 });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault();
        selectedOptions.forEach(so => {
            if (so.optionId === '') {
                return
            }
        })

        selectedOptions.forEach(so =>
            BaseService.post(so, '/selectedoptions', true, appState.token!)
        )
        history.replace('/quizzes')
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        Object.keys(quiz).length !== 0 ? quiz.questions[0].options.find(it => it.selectedOptions.find(so => so.appUserId === appState.userId) !== undefined) === undefined ?
            <>
                <h4>{quiz.title}</h4>
                <hr />
                <form onSubmit={(e) => submitClicked(e.nativeEvent)}>
                    {numbering.map(num =>
                        <div className="form-group">
                            <p><b>{quiz.questions[num].content}</b></p>
                            {quiz.questions[num].options.map(o =>
                                <>
                                    <input style={{ marginLeft: '1rem' }} type='radio' id={o.id} name={num.toString()} onChange={() =>
                                        selectedOptions[num].optionId = o.id
                                    } />
                                    <label style={{ marginLeft: '0.25rem' }} htmlFor={num.toString()}>{o.content}</label>
                                </>
                            )}
                        </div>
                    )}
                    <div className="form-group">
                        <button onClick={(e) => submitClicked(e.nativeEvent)} type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
                <Loader {...pageStatus} />
            </> :
            <>
                <h4>You already answered this quiz/poll!</h4>
            </> : (null)
    );
}

export default QuizTaking;
