import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";

import { Card, Container } from 'react-bootstrap';
import { AppContext } from "../../context/AppContext";
import { IQuiz } from "../../dto/IQuiz";

const Quiz = (props: { quiz: IQuiz }) => (
    <Card style={{ maxWidth: '18rem', marginRight: '1rem' }}>
        <Card.Body>
            <Card.Title>{props.quiz.isPoll ? "Poll:" : "Quiz:"} {props.quiz.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{"Questions: " + props.quiz.questions.length}</Card.Subtitle>
            <Link to={"/quiz/" + props.quiz.id}>Start</Link>
            <Link style={{ marginLeft: '1rem' }} to={"/quiz/" + props.quiz.id + "/results"} >Results</Link>
        </Card.Body>
    </Card>
);

const Quizzes = (props: { quizzes: IQuiz[] }) => (
    <Container className="d-inline-flex flex-wrap">
        {props.quizzes.map(q =>
            <Quiz quiz={q} />
        )}
    </Container>
);

const QuizIndex = () => {
    const appState = useContext(AppContext);
    const [quizzes, setQuizzes] = useState([] as IQuiz[])
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const loadData = async () => {
        let result = await BaseService.getAll<IQuiz>('/quizzes', appState.token!);

        if (result.ok && result.data) {
            setQuizzes(result.data)
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: 404 });
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <Quizzes quizzes={quizzes} />
            <Loader {...pageStatus} />
        </>
    );
}

export default QuizIndex;
