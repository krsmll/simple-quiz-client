import Paper from '@material-ui/core/Paper';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IRouteId } from '../../types/IRouteId';
import { AppContext } from '../../context/AppContext';
import { IQuiz } from '../../dto/IQuiz';
import { EPageStatus } from '../../types/EPageStatus';
import { BaseService } from '../../services/base-service';
import { IQuestionData } from '../../types/IQuestionData';
import { IChartDataPoint } from '../../types/IChartDataPoint';
import Loader from '../../components/Loader';
import { Container, Row } from 'react-bootstrap';
import { IQuestion } from '../../dto/IQuestion';

const QuestionData = (props: { questionData: IQuestionData }) => (
    <Paper style={{ marginBottom: "1rem" }}>
        <Chart data={props.questionData.dataPoints}>
            <ArgumentAxis />
            <ValueAxis />

            <BarSeries
                valueField="selectedNumber"
                argumentField="option"
            />
            <Title text={props.questionData.title} />
            <Animation />
        </Chart>
    </Paper>
)

const SelfData = (props: { questions: IQuestion[], userId: string }) => {
    let arr: IQuestion[] = props.questions.map(q =>
        ({ ...q, options: q.options.filter(o => o.selectedOptions.find(so => so.appUserId === props.userId) !== undefined) })
    )

    return <>
        {arr.map(q =>
            <Container style={{ marginBottom: '2rem' }}>
                <Row>
                    <div style={{marginRight: '2rem'}}>
                        <h6>Question:</h6>
                        <b>{q.content}</b>
                    </div>
                    <div>
                        <h6>Answer:</h6>
                        <span className={q.options[0].isCorrect ? "text-success" : "text-danger"}><b>{q.options[0].content}</b></span>
                    </div>
                </Row>
            </Container>
        )}
    </>;
}


const QuizResults = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [quiz, setQuiz] = useState({} as IQuiz);
    const [chartData, setChartData] = useState([] as IQuestionData[])
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const loadData = async () => {
        let result = await BaseService.get<IQuiz>(id, '/quizzes', appState.token!);

        if (result.ok && result.data) {
            setQuiz(result.data)
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });

            let questionData: IQuestionData[] = [];
            result.data.questions.forEach(q => {
                questionData.push({
                    "title": q.content, "dataPoints": q.options.map(o =>
                        ({ "selectedNumber": o.selectedOptions.length, "option": o.content, "correctAnswer": o.isCorrect }))
                })
            })
            console.log(questionData);
            setChartData(questionData)
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: 404 });
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        quiz.isPoll ?
            <>
                <h4>Results: {quiz.title}</h4>
                <hr />
                <Container>
                    {chartData.map(data =>
                        <QuestionData questionData={data} />
                    )}
                </Container>
                <Loader {...pageStatus} />
            </>
            :
            Object.keys(quiz).length !== 0 && quiz.questions[0].options.find(it => it.selectedOptions.find(so => so.appUserId === appState.userId) !== undefined) !== undefined ? <>
                <h4>{quiz.title}</h4>
                <hr />
                <Container className="d-inline-flex flex-wrap">
                    <Container style={{ width: '50%' }}>
                        <h4>All results: </h4>
                        <hr />
                        {chartData.map(data =>
                            <QuestionData questionData={data} />
                        )}
                    </Container>
                    <Container style={{ width: '50%' }}>
                        <h4>Your results: </h4>
                        <hr />
                        <SelfData questions={quiz.questions} userId={appState.userId} />
                    </Container>
                    <Loader {...pageStatus} />
                </Container>
            </>
                :
                <>
                    <h4>Please answer the quiz before accessing the results!</h4>
                </>
    );
}

export default QuizResults;