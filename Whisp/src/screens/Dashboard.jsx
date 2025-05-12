import './Dashboard.css';
import { useState, useEffect, useRef } from 'react';
import {io} from 'socket.io-client'
import {API_URL} from '../config'

function Dashboard(props) {
  const [activeContact, setActiveContact] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null)
  const [rightPanelView, setRightPanelView] = useState("chat")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setLocalUserData] = useState(() => {
    // If props.userData is available, use it
    if (props.userData && props.userData.user) {
      return props.userData;
    }
    
    // Otherwise try to get from localStorage
    try {
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);
        console.log("Initialized userData from localStorage");
        return parsedUserData;
      }
    } catch (error) {
      console.error("Error initializing userData from localStorage:", error);
    }
    
    return props.userData;
  });
  const [successStatus, setSuccessStatus] = useState(false)
  const [friendRequests, setFriendRequests] = useState([])
  const [friends, setFriends] = useState([])
  const [friendUsername, setFriendUsername] = useState("")
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (!userData || !userData.user) {
      console.log("userData is null or missing user property, trying to recover from props");
      if (props.userData && props.userData.user) {
        console.log("Recovered userData from props");
        setLocalUserData(props.userData);
      } else {
        console.log("Trying to recover userData from localStorage");
        try {
          const savedUserData = localStorage.getItem('userData');
          if (savedUserData) {
            const parsedUserData = JSON.parse(savedUserData);
            console.log("Recovered userData from localStorage");
            setLocalUserData(parsedUserData);
          } else {
            console.error("Could not recover userData from localStorage");
          }
        } catch (error) {
          console.error("Error recovering userData from localStorage:", error);
        }
      }
    }
  }, [props.userData, userData]);

  //get friends list
  const fetchFriends = async () => {
    if (!userData || !userData.user) {
      console.error('Cannot fetch friends: User not logged in or user data not available');
      return;
    }
    
    try {
      console.log(`Fetching friends for user ${userData.user.id}`);
      const response = await fetch(`${API_URL}/api/getfriends/${userData.user.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch friends: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Friends data received:", data);
      
      if (data.friends) {
        setFriends(data.friends);
        console.log(`Set ${data.friends.length} friends in state`);
        
        // Save to localStorage as backup
        localStorage.setItem(`friends_${userData.user.id}`, JSON.stringify(data.friends));
      } else {
        console.warn("No friends array in response:", data);
        setFriends([]);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      
      try {
        const savedFriends = localStorage.getItem(`friends_${userData.user.id}`);
        if (savedFriends) {
          console.log("Recovering friends from localStorage");
          setFriends(JSON.parse(savedFriends));
        }
      } catch (localStorageError) {
        console.error("Could not recover friends from localStorage:", localStorageError);
      }
    }
  };

  useEffect(() => {
    if (!userData || !userData.user) return;
    
    console.log("Setting up socket connections for user:", userData.user.id);
    

    const connectionOptions = {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    };
    
    const newSocket = io(API_URL, connectionOptions);
    
    newSocket.on('connect', () => {
      console.log("Socket connected, joining room:", `user_${userData.user.id}`);
      newSocket.emit('join', { user_id: userData.user.id });
      setSocket(newSocket);
    });
    
    newSocket.on('connect_error', (error) => {
      console.error("Socket connection error:", error);
    });
    
    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
      newSocket.emit('join', { user_id: userData.user.id });
    });

    newSocket.on('friend_request', (data) => {
      console.log("Received friend request:", data);
      setFriendRequests(prevRequests => {
        const exists = prevRequests.some(req => req.id === data.id);
        if (exists) return prevRequests;
        return [...prevRequests, {
          id: data.id,
          sender_id: data.sender_id,
          sender_username: data.sender_username
        }];
      });
    });

    newSocket.on('friend_request_accepted', (data) => {
      console.log('Friend request accepted:', data);
      fetchFriends();
    });


    newSocket.on('new_message', (data) => {
      console.log('New message received:', data);
      setMessages(prev => [...prev, {
        id: data.id,
        sender_id: data.sender_id,
        content: data.content,
        timestamp: data.timestamp
      }])

      
    });

    return () => {
      console.log("Disconnecting socket for user:", userData.user.id);
      if (newSocket) newSocket.disconnect();
    };
  }, [userData]);


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) {
      console.error('Message cannot be empty');
      return;
    }

    if (!socket) {
      console.error('Socket connection not established');
      alert('Cannot connect to server. Please try again later.');
      return;
    }

    socket.emit('private_message', {
      sender_id: userData.user.id,
      receiver_id: activeContact,
      content: inputMessage
    }, (response) => {
      if (response && response.success) {
        setInputMessage(''); // Just clear the input
      } else {
        console.error('Failed to send message:', response ? response.message : 'No response from server');
        alert('Failed to send message. Please try again later.');
      }
    });
  }

  //get friend requests and friends
  useEffect(() => {
    if(userData && userData.user){
      fetchFriendRequests();
      fetchFriends();
    }
  }, [userData]);

  const fetchFriendRequests = async () => {
    if (!userData || !userData.user) {
      console.error('Cannot fetch friend requests: User not logged in or user data not available');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/getfriendrequests/${userData.user.id}`)
      const data = await response.json()
      
      if(data.requests){
        setFriendRequests(data.requests.map(req => ({
          id: req.id,
          sender_id: req.sender_id,
          sender_username: req.sender_username
        })));
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error)
    }
  }
      

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!friendUsername.trim()) {
      console.error('Username cannot be empty');
      return;
    }
    
    //if userdata is missing for logged in user
    if (!userData || !userData.user) {
      try {
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
          const parsedUserData = JSON.parse(savedUserData);
          setLocalUserData(parsedUserData);
          
          // Wait a moment for state to update
          await new Promise(resolve => setTimeout(resolve, 100));
          
          //check if worked
          if (!userData || !userData.user) {
            console.error('Recovery failed - User not logged in or user data not available');
            alert('You must be logged in to add friends');
            return;
          }
        } else {
          console.error('User not logged in or user data not available');
          alert('You must be logged in to add friends');
          return;
        }
      } catch (error) {
        console.error('Error recovering user data:', error);
        alert('You must be logged in to add friends');
        return;
      }
    }
    
    //prevents adding themselves
    if (userData.user.username.toLowerCase() === friendUsername.toLowerCase()) {
      alert("You cannot add yourself as a friend.");
      return;
    }
    
    //prevents adding existing friends
    const isAlreadyFriend = friends.some(
      friend => friend.username.toLowerCase() === friendUsername.toLowerCase()
    );
    
    if (isAlreadyFriend) {
      alert("This user is already in your friends list.");
      setFriendUsername('');
      return;
    }
    
    if (!socket) {
      console.error('Socket connection not established');
      alert('Cannot connect to server. Please try again later.');
      return;
    }
    
    console.log(`Sending friend request from user ${userData.user.id} to ${friendUsername}`);
    
    socket.emit('send_friend_request', {
      sender_id: userData.user.id,
      receiver_username: friendUsername
    }, (response) => {
      console.log("Friend request response:", response);
      
      if (response && response.success) {
        setSuccessStatus(true);
        setFriendUsername('');
        setTimeout(() => {
          setSuccessStatus(false);
        }, 5000);
      } else {
        const errorMessage = response ? response.message : 'No response from server';
        console.error('Failed to send friend request:', errorMessage);
        alert(`Failed to send friend request: ${errorMessage}`);
      }
    });
  };

  const acceptFriendRequest = (requestId) => {
    if (!socket) {
      console.error('Socket connection not established');
      alert('Cannot connect to server. Please try again later.');
      return;
    }
    
    socket.emit('accept_friend_request', { request_id: requestId }, (response) => {
      if (response && response.success) {
        setFriendRequests(prevRequests => 
          prevRequests.filter(req => req.id !== requestId)
        );
        //refreshes on new friend
        fetchFriends();
      } else {
        console.error('Failed to accept friend request:', response ? response.message : 'No response');
      }
    });
  };

  const rejectFriendRequest = (requestId) => {
    if (!socket) {
      console.error('Socket connection not established');
      alert('Cannot connect to server. Please try again later.');
      return;
    }
    
    socket.emit('reject_friend_request', { request_id: requestId }, (response) => {
      if (response && response.success) {
        setFriendRequests(prevRequests => 
          prevRequests.filter(req => req.id !== requestId)
        );
      } else {
        console.error('Failed to reject friend request:', response ? response.message : 'No response');
      }
    });
  };

  const rightPanel  = () => {
    if(rightPanelView === 'chat'){
      //loads active contact
      const activeFriend = friends.find(f => f.user_id === activeContact);
      
      return (
        <div className="chat-panel">
        {activeContact && activeFriend ? (
          <>
            <div className="chat-header">
              <h3>{activeFriend.username}</h3>
            </div>
            
            <div className="chat-messages">
              {!messages ? (
                <div className="welcome">
                  Start of your conversation with {activeFriend.username}
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div key={message.id} className={message.sender_id === userData.user.id ? 'message-sent' : 'message-received'}>
                      <div className="message-content">
                        {message.content}
                      </div>
                      <div className="message-timestamp">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            <div className="chat-input">
              <form onSubmit={handleSendMessage}>
                <input
                  type="text" 
                  placeholder="Type a message..." 
                  onChange={(e) => setInputMessage(e.target.value)}
                  value={inputMessage}
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </>
        ) : activeContact ? (
          <div className="no-chat">
            <p>Loading conversation data...</p>
            <button onClick={fetchFriends}>Refresh friends list</button>
          </div>
        ) : (
          <div className="no-chat">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
      );
    }
    if(rightPanelView === 'add-friend'){
      return(
        <div className="add-friend-panel">
          <div className="panel-header">
            <h3>Add Friend</h3>
          </div>
          <div className="add-friend-input">
            <form onSubmit={handleAddFriend}>
              <input 
                type="text" 
                placeholder="Enter username" 
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
              />
              <button type="submit">Add</button>
            </form>
          </div>
          <div className="success-message">
            {successStatus && <div>Friend request sent successfully!</div>}
          </div>
          
          <div className="friend-requests-section">
            <h4>Friend Requests</h4>
            <div className='friend-request-list'>
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <div key={request.id} className="friend-request">
                    <div className="friend-request-info">
                      <span className="friend-request-username">{request.sender_username}</span>
                      <button 
                        className="accept-button"
                        onClick={() => acceptFriendRequest(request.id)}
                      >
                        Accept
                      </button>
                      <button 
                        className="reject-button"
                        onClick={() => rejectFriendRequest(request.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No pending friend requests</p>
              )}
            </div>
          </div>
        </div>
      )
    }
  }

  //load friends when switching views
  useEffect(() => {
    if (rightPanelView === 'chat' && userData && userData.user) {
      console.log("Switched to chat view, refreshing friends list");
      fetchFriends();
    }
  }, [rightPanelView]);

  // Handle clicking on a contact
  const handleContactClick = async(contactId) => {
    console.log("Contact clicked with ID:", contactId);
    setActiveContact(contactId);
    //fetch message history
    const response = await fetch(`${API_URL}/api/getmessages/${userData.user.id}/${contactId}`)

    const data = await response.json()

    if (data.messages){
      setMessages(data.messages)
    }

    setRightPanelView('chat');
    setIsMobileMenuOpen(false); // Close mobile menu when a contact is clicked
    console.log("Set active contact to:", contactId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="dashboard">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          ☰
        </button>
        {activeContact && (
          <h3>{friends.find(f => f.user_id === activeContact)?.username || 'Chat'}</h3>
        )}
      </div>

      {/* Left panel - contacts - buttons */}
      <div className={`contacts-panel ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="panel-header">
          <h3>Direct Messages</h3>
        </div>
        
        <div className="contacts-list">
          {friends.length > 0 ? (
            friends.map(friend => (
              <div 
                key={friend.id}
                className={`contact ${activeContact === friend.user_id ? 'active' : ''}`}
                onClick={() => handleContactClick(friend.user_id)}
              >
                <div className={`status online`}></div>
                <div className="contact-info">
                  <div className="name">{friend.username}</div>
                  <div className="message">Click to start chatting</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-contacts">
              <p>No friends yet. Add friends to start chatting!</p>
            </div>
          )}
        </div>
        
        <div className="user-bar">
          <div className="username">{props.userData?.user?.username || "User"}</div>
          <div className="action-buttons">
            <button className="action-btn add-user" title="Add Friend" onClick={() => setRightPanelView("add-friend")}>+</button>
            <button 
              className="action-btn logout" 
              title="Logout"
              onClick={() => {
                // Clear localStorage
                localStorage.removeItem('userData');
                localStorage.removeItem(`friends_${userData?.user?.id}`);
                
                // Clear cookies and state
                document.cookie = "isAuthenticated=false; max-age=0; path=/";
                props.setIsAuthenticated(false);
                props.setUserData(null);
                props.setCurrentView("login");
              }}
            >
              ⏏️
            </button>
          </div>
        </div>
      </div>

      {/* Right panel - chat */}
      {rightPanel()}
    </div>
  );
}

export default Dashboard;