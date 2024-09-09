import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ navigate('/') }
  const redirectToArticles = () => { /* ✨ implement */ navigate('articles')}
  const token = localStorage.getItem('token')
  let updateMessage = true;

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    redirectToLogin()
    localStorage.removeItem('token')
    setMessage("Goodbye!")
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!


    try {
      setSpinnerOn(true)
      const { data } = await axios.post(
        loginUrl,
        { username, password }
      )
      localStorage.setItem('token', data.token)
      redirectToArticles()
      setMessage(data.message)
    }catch (err){
      setMessage(err.message || 'An error ocurred. Please try again.')
    }finally {
      setSpinnerOn(false)
    }
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner
  
    //const token = localStorage.getItem('token')

    setSpinnerOn(true)

    axios.get(articlesUrl, {
      headers: {
        Authorization: token
      },
    })
      .then(response => {
        setArticles(response.data.articles)
        if(updateMessage){
          setMessage(response.data.message)
        }
        console.log(articles)
      })
      .catch(error => {
        setMessage(error.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
      
  }
 

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true)
    
    axios.post(articlesUrl, article, {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        updateMessage = false
        getArticles();
        setMessage(res.data.message)
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })

  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!

    setCurrentArticleId(article_id)

    setSpinnerOn(true)

    console.log("updated")

    console.log(article_id + " " + JSON.stringify(article, null, 2))
    //console.log("article " + article.title)

    axios.put(`${articlesUrl}/${article_id}`, article, {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        updateMessage = false
        getArticles();
        setMessage(res.data.message)
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
    
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true)
    
    axios.delete(`${articlesUrl}/${article_id}`, {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        updateMessage = false
        setMessage(res.data.message)
        getArticles();
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })

  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm
                setCurrentArticleId={setCurrentArticleId}
                deleteArticle={deleteArticle}
                updateArticle={updateArticle}
                articles={articles}
                postArticle={postArticle}
                currentArticleId={currentArticleId}
              />
              <Articles 
                updateArticle={updateArticle}
                getArticles={getArticles}
                articles={articles}
                setCurrentArticleId={setCurrentArticleId}
                deleteArticle={deleteArticle}  
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
