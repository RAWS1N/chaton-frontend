import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext()

export const ChatState = () => {
    return useContext(ChatContext)
}

function ChatProvider({ children }) {
    const Navigator = useNavigate()
    const [user, setUser] = useState([])
    const [selectedChat,setSelectedChat] = useState(null)
    const [currentChat,setCurrentChat] = useState(null)
    const [chats,setChats] = useState([])
    const [notification,setNotification] = useState([])

    useEffect(() => {
        const fetchUserData = async () => {
          const userInfo = await JSON.parse(localStorage.getItem("user"));
          if (!userInfo) {
            Navigator("/");
            return 
          }
          setUser(userInfo);
          // setNotification(userInfo?.notification)
        };
        fetchUserData();
      }, [Navigator])



    return (
        <ChatContext.Provider value={{ 
          user,
          setUser,
          selectedChat,
          setSelectedChat,
          chats,
          setChats,
          notification,
          setNotification,
          currentChat,setCurrentChat
           }}>
            {children}
        </ChatContext.Provider>
    )
}


export default ChatProvider