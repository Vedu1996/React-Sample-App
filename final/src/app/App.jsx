import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import React, { Component } from 'react';

import Gallery from '../gallery/Gallery';
import './app.css';
import '../bootstrap/css/bootstrap.min.css';

class App extends Component {

    render() {
        return (
            <Gallery />
        );
    }

}

export default App;
