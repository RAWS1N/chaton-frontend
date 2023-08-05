import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../components/Layout/SideDrawer'
import { Box } from '@chakra-ui/react'
import Chats from '../components/ChatComponents/Chats'
import ChatBox from '../components/ChatComponents/ChatBox'
const ChatPage = () => {
  const {user,setUser} = ChatState()
  const [fetchAgain,setFetchAgain] = useState(false)

  const containerStyle = {
    width : "100%",
  }


  return (
    <div style={containerStyle}>
        {user ? <SideDrawer/> : null}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user ? <Chats fetchAgain={fetchAgain} /> : null}
          {user ? <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> : null}
        </Box>
    </div>
  )
}

export default ChatPage