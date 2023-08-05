import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from '../Layout/ChatLoading'
import { getSender } from '../../utils/ChatLogic'
import GroupChatModal from '../Modal/GroupChatModal'
import Server from '../../utils/Server'

const Chats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState()
  const { user, setUser, setSelectedChat, setChats, chats, selectedChat } = ChatState()
  const toast = useToast()

  const fetchChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    const { data } = await Server.get("/chat", config)
    setChats(data.data)
  }


  useEffect(() => {
    const fetchUser = async() => {
      const userData = await JSON.parse(localStorage.getItem('user'))
       setLoggedUser(userData)
    }
    fetchUser()
    fetchChats()
  }, [user,fetchAgain,selectedChat])

useEffect(() => {
  const fetchUser = async() => {
    const userData = await JSON.parse(localStorage.getItem('user'))
     setLoggedUser(userData)
  }
  fetchUser()
  fetchChats()
},[])

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      background="white"
      width={{ base: '100%', md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        padding={3}
        fontSize={{ base: '28px', md: '24px' }}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: '10px', lg: '14px' }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        width="100%"
        background="#f8f8f8"
        height="100%"
        borderRadius='lg'
        overflowY="hidden"
      >
        {chats ? <Stack overflowY="scroll">
          {chats?.map(chat => (
            <Box
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              cusrsor="pointer"
              background={selectedChat?._id === chat._id ? "#38b2ac" : "#e8e8e8"}
              color={selectedChat?._id === chat._id ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
            >
              <Text>
                {!chat.isGroupChat &&  user && chat.users ? getSender(user, chat.users) : chat.chatName}
              </Text>
            </Box>
          ))}
        </Stack> : <ChatLoading />}
      </Box>
    </Box>
  )
}

export default Chats