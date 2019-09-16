import React from 'react';
import './App.css';
import Header from './components/header';
import Home from './components/home';
import {Router} from '@reach/router'
import ArticlesList from "./components/artcilesList";
import SingleArticle from './components/singleArticle';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Home path="/" />
        <ArticlesList path="/articles" />
        <SingleArticle path="/articles/:article_id" />
      </Router>
    </div>
  );
}

export default App;
