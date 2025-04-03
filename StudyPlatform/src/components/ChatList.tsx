import { MessageSquare, Plus, Search } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"
import ProfileImage from "./ProfileImage"

const ChatList: React.FC = () => {
  // Sample chat data
  const chats = [
    { id: 1, name: "John Doe", profilePic: null, lastMessage: "Hey, how's it going?", time: "5m ago", unread: 2 },
    {
      id: 2,
      name: "Study Group",
      profilePic: null,
      lastMessage: "When is the next meeting?",
      time: "1h ago",
      unread: 0,
    },
    { id: 3, name: "Jane Smith", profilePic: null, lastMessage: "Thanks for the notes!", time: "3h ago", unread: 0 },
    {
      id: 4,
      name: "Professor Williams",
      profilePic: null,
      lastMessage: "Please submit your assignment by Friday",
      time: "Yesterday",
      unread: 1,
    },
  ]

  return (
    <div className="row g-4 w-100">
      {/* Left Sidebar - Chat List */}
      <div className="col-lg-4">
        <div className="card border-0 shadow-sm h-100 custom-card">
          <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">Conversations</h5>
            <Link to="/chat/new" className="btn btn-primary btn-sm d-flex align-items-center">
              <Plus size={16} className="me-1" /> New Chat
            </Link>
          </div>
          <div className="card-body p-0">
            {/* Search */}
            <div className="p-3 border-bottom">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  name="searchConversations"
                  className="form-control bg-light border-start-0"
                  placeholder="Search conversations..."
                />
              </div>
            </div>

            {/* Chat list */}
            <div className="list-group list-group-flush">
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className="list-group-item list-group-item-action p-3 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-3">
                      {chat.id === 2 ? (
                        <div
                          className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "48px", height: "48px" }}
                        >
                          <MessageSquare size={20} className="text-primary" />
                        </div>
                      ) : (
                        <ProfileImage src={chat.profilePic} alt={chat.name} size={48} />
                      )}
                      {chat.unread > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-grow-1 min-width-0">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="mb-0 text-truncate">{chat.name}</h6>
                        <small className="text-muted ms-2">{chat.time}</small>
                      </div>
                      <p className="mb-0 text-muted small text-truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Chat Preview */}
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm h-100 custom-card d-flex justify-content-center align-items-center">
          <div className="text-center p-5">
            <div
              className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-4"
              style={{ width: "80px", height: "80px" }}
            >
              <MessageSquare size={40} className="text-primary" />
            </div>
            <h4>Select a conversation</h4>
            <p className="text-muted mb-4">Choose a conversation from the list or start a new chat</p>
            <Link to="/chat/new" className="btn btn-primary">
              Start New Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatList

