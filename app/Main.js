import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"

import { CSSTransition } from "react-transition-group"
Axios.defaults.baseURL = process.env.BACKENDURL || ""

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

//My Components
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
const CreatePost = React.lazy(() => import("./components/CreatePost"))
const SinglePost = React.lazy(() => import("./components/SinglePost"))
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import DeletePost from "./components/DeletePost"
import NotFound from "./components/NotFound"
const Search = React.lazy(() => import("./components/Search"))
const Chat = React.lazy(() => import("./components/Chat"))
import LoadingDotsIcon from "./components/LoadingDotsIcon"

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return

      case "openSearch":
        draft.isSearchOpen = true
        return

      case "closeSearch":
        draft.isSearchOpen = false
        return

      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen
        return

      case "closeChat":
        draft.isChatOpen = false
        return

      case "incrementUnreadChatCount":
        draft.unreadChatCount++
        return

      case "clearUnreadChatCount":
        draft.unreadChatCount = 0
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token)
      localStorage.setItem("complexappUsername", state.user.username)
      localStorage.setItem("complexappAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("complexappToken")
      localStorage.removeItem("complexappUsername")
      localStorage.removeItem("complexappAvatar")
    }
  }, [state.loggedIn])

  //check if token is expired or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      //send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token })
          if (!response.data) {
            dispatch({ type: "logout" })
            dispatch({ type: "flashMessage", value: "Your session has expired. Please Log In again" })
          }
        } catch (e) {
          console.log("There was a problem or request was cancelled.")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <FlashMessages messages={state.flashMessages} />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              <Route path="/profile/:username/*" element={<Profile />} />
              <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
              <Route path="/post/:id" element={<SinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay-bottom">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)
