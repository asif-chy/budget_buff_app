import React, { Component } from "react";

import HomePage from './pages/homePage';
import BudgetPage from './pages/budgetPage';
import NotFoundPage from './pages/notFoundPage';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/budget" component={BudgetPage} />
                    <Route exact path="/404" component={NotFoundPage} />
                    <Redirect to ="/404"></Redirect>
                </Switch>
            </Router>
        );
    }
}

export default App;
