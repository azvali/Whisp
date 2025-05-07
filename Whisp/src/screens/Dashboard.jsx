import './Dashboard.css';
import { useState, useEffect, useRef} from 'react';
import {io} from 'socket.io-client'
import {api_url} from '../config'

function Dashboard(props) {
  const [activeContact, setActiveContact] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState({})
  const [socket, setSocket] = useState(null)
  const messageEndRef = useRef(null)

  const userData = props.userData


  // Sample contacts data
  const contacts = [
    { id: 1, name: "John Doe", status: "online", lastMessage: "Hey, how are you?" },
    { id: 2, name: "Alice Smith", status: "offline", lastMessage: "Let's meet tomorrow" },
    { id: 3, name: "Bob Johnson", status: "online", lastMessage: "Did you get my email?" },
    { id: 4, name: "Emma Wilson", status: "online", lastMessage: "Thanks for your help!" },
    { id: 5, name: "Michael Brown", status: "offline", lastMessage: "See you later" },
    { id: 6, name: "Sarah Davis", status: "online", lastMessage: "Can you call me?" },
    { id: 7, name: "David Miller", status: "online", lastMessage: "I'll send you the files" },
    { id: 8, name: "Jessica Taylor", status: "offline", lastMessage: "Have a nice day!" }
  ];


  const getMessages = async () => {

  }

  return (
    <div className="dashboard">
      {/* Left panel - contacts - buttons */}
      <div className="contacts-panel">
        <div className="panel-header">
          <h3>Direct Messages</h3>
        </div>
        
        <div className="contacts-list">
          {contacts.map(contact => (
            <div 
              key={contact.id}
              className={`contact ${activeContact === contact.id ? 'active' : ''}`}
              onClick={() => setActiveContact(contact.id)}
            >
              <div className={`status ${contact.status}`}></div>
              <div className="contact-info">
                <div className="name">{contact.name}</div>
                <div className="message">{contact.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="user-bar">
          <div className="username">{props.userData?.user?.username || "User"}</div>
          <div className="action-buttons">
            <button className="action-btn add-user" title="Add Friend">+</button>
            <button className="action-btn settings" title="Settings">⚙️</button>
            <button 
              className="action-btn logout" 
              title="Logout"
              onClick={() => {
                props.setIsAuthenticated(false);
                props.setCurrentView("login");
                document.cookie = "isAuthenticated=false; max-age=0; path=/";
              }}
            >
              ⏏️
            </button>
          </div>
        </div>
      </div>

      {/* Right panel - chat */}
      <div className="chat-panel">
        {activeContact ? (
          <>
            <div className="chat-header">
              <h3>{contacts.find(c => c.id === activeContact)?.name}</h3>
            </div>
            
            <div className="chat-messages">
              <div className="welcome">
                Start of your conversation with {contacts.find(c => c.id === activeContact)?.name}
              </div>
            </div>
            
            <div className="chat-input">
              <input 
                type="text" 
                placeholder="Type a message..." 
                onChange={(e) => setInputMessage(e.target.value)}
                value={inputMessage}
              />
              <button>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;