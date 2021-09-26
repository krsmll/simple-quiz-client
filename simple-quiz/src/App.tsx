import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Page404 from './containers/Page404';
import { AppContextProvider, initialAppState } from './context/AppContext';

import HomeIndex from './containers/home/HomeIndex';
import Login from './containers/identity/Login';
import Register from './containers/identity/Register';
import QuizIndex from './containers/quizzes/QuizIndex';
import QuizResults from './containers/quizzes/QuizResults';
import QuizTaking from './containers/quizzes/QuizTaking';


function App() {
  const setAuthInfo = (token: string | null, roles: string[], username: string, userId: string): void => {
    setAppState({ ...appState, token, roles, username, userId });
  }

  const [appState, setAppState] = useState({ ...initialAppState, setAuthInfo });

  return (
    <>
      <AppContextProvider value={appState} >
        <Header />
        <div className="container">
          <main role="main" className="pb-3">
            <Switch>
              <Route exact path="/" component={HomeIndex} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path='/quizzes' component={QuizIndex} />

              <Route path='/quiz/:id/results' render={props => <QuizResults key={props.match.params.id} />} />
              <Route path='/quiz/:id' render={props => <QuizTaking key={props.match.params.id} />} />
              <Route component={Page404} />
            </Switch>
          </main>
        </div>
        <Footer />
      </AppContextProvider>
    </>
  );
}

export default App;
