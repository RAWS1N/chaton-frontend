import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../../utils/ChatLogic'
import ProfileModal from '../Modal/ProfileModal'
import UpdateGroupChatModal from '../Modal/UpdateGroupChatModal'
import Server from '../../utils/Server'
import ScrollableChat from '../ScrollableChat/ScrollableChat'
import io from 'socket.io-client'
import useManageNotification from '../../hooks/useManageNotification'

const endPoint = import.meta.env.VITE_API_URL
let socket
let selectedChatCompare


function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const toast = useToast()
  const ManageNotification = useManageNotification()
  const { 
    user, 
    selectedChat, 
    setSelectedChat, 
    notification, 
    setNotification,
    setCurrentChat
   } = ChatState()
  
  const fetchMessages = async () => {
    if (!selectedChat) return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      setLoading(true)
      const { data } = await Server.get(`/message/${selectedChat._id}`, config)
      setMessages(data.data)
      setLoading(false)
      setFetchAgain(prevState => !prevState)
      socket.emit('join room', selectedChat._id)
    }
    catch (e) {
      console.log(e)
      setLoading(false)
      toast({
        title: "Error Occured",
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        status: "error"
      })
    }
  }

  const addNotification = async (message) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const postData = {
        message_id: message._id,
        user_id: user._id
      }
      const { data } = await Server.post(`/user/notification`, postData, config)
    } catch (e) {
      console.log(e)
    }

  }

  const removeAllNotification = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await Server.get(`/user/notification/remove`, config)
      console.log(data)
    }
    catch (e) {
      console.log("notification removed")
    }
  }

  const sendMessage = async (e) => {
    if (!(e.key === 'Enter' && newMessage)) return
    try {
      setNewMessage('')
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const postData = {
        content: newMessage,
        chatId: selectedChat._id
      }
      setLoading(true)
      const { data } = await Server.post(`/message`, postData, config)


      socket.emit('new message', data.data)
      setMessages(prevState => ([...prevState, data.data]))
      setLoading(false)
    }
    catch (e) {
      console.log(e)
      setLoading(false)
      toast({
        title: "Error Occured",
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        status: "error"
      })
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)
    if (!socketConnected) return
    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id)
    }
    let lastTypingTime = new Date().getTime()
    const timerLength = 3000
    setTimeout(() => {
      const currentTime = new Date().getTime()
      const timeDifference = currentTime - lastTypingTime
      if (timeDifference >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  useEffect(() => {
    socket = io(endPoint)
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
  }, [user])

  const shouldRemoveNotification = () => {
    if (!selectedChat) return
    const sender = getSender(user, selectedChat.users)
    const data = notification.filter(notif => getSender(user, notif.chat.users) !== sender)
    setNotification(data)
    removeAllNotification()
  }

  useEffect(() => {
    selectedChatCompare = selectedChat
    fetchMessages()
    shouldRemoveNotification()
    return () => console.log('unmounted')
  }, [selectedChat,user])


useEffect(() => {
  setCurrentChat(selectedChat)
},[])


  useEffect(() => {
    const messageReceivedHandler = async (newMessage) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
        ManageNotification(newMessage)
        if (!notification.includes(newMessage)) {
          
          // setNotification(prevState => ([newMessage, ...prevState]));
          await addNotification(newMessage)
          setFetchAgain(prevState => !prevState)
        }
      } else {
        setMessages(prevState => ([...prevState, newMessage]));
      }
    };

    socket.on('message received', messageReceivedHandler);

    return () => {
      socket.off('message received', messageReceivedHandler); // Clean up the event listener
    };
  }, [socket, selectedChatCompare]);

  return (
    <>
      {selectedChat ?
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={2}
            px={2}
            width="100%"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            <>
              {!selectedChat.isGroupChat ? (
                <>
                  {user && selectedChat?.users && getSender(user, selectedChat.users)}
                  <ProfileModal user={user && selectedChat?.users && getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              )}
            </>
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            width="100%"
            height="100%"
            background="#e8e8e8"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                width={20}
                height={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <>Loading</> : <></>}
              <Input
                background="white"
                type="text"
                placeholder="Enter a Message..."
                name="search"
                value={newMessage}
                onChange={typingHandler}

              />
            </FormControl>
          </Box>
        </>
        : (
          <Box display="flex" alignItems='center' justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3}>Click on a user to start chatting</Text>
          </Box>
        )}
    </>
  )
}

export default SingleChat