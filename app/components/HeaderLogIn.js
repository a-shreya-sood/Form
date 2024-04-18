import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import { Tooltip as ReactTooltip } from "react-tooltip"

function HeaderLogIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  function handleLogOut() {
    appDispatch({ type: "logout" })
    appDispatch({ type: "flashMessage", value: "You have Successfully Logged Out." })
  }

  function handleSearchIcon(e) {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a data-tooltip-id="search" data-tooltip-content="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      <span onClick={() => appDispatch({ type: "toggleChat" })} data-tooltip-id="chat" data-tooltip-content="Chat" className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white")}>
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? <span className="chat-count-badge text-white">{appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}</span> : ""}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link data-tooltip-id="profile" data-tooltip-content="Profile" to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
      <Link data-tooltip-id="create post" data-tooltip-content="Create Post" className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <ReactTooltip place="bottom" id="create post" className="custom-tooltip" />
      <button data-tooltip-id="sign out" data-tooltip-content="Sign Out" onClick={handleLogOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
      <ReactTooltip place="bottom" id="sign out" className="custom-tooltip" />
    </div>
  )
}

export default HeaderLogIn
