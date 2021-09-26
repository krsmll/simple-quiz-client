import { useContext } from "react";
import { Container } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";

const HomeIndex = () => {
    const appState = useContext(AppContext);

    return (
        <Container style={{ textAlign: 'center' }}>
            <h3>Quizzes and Polls</h3>
        </Container>
    );
}

export default HomeIndex;