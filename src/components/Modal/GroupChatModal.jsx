import React, { useState } from 'react'
import { Box, Button, FormControl, FormLabel, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import UserListItem from '../userAvatar/UserListItem'
import UserBadgeItem from '../UserBadgeItem'
import Server from '../../utils/Server'

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user,setChats,chats } = ChatState()
  const [search, setSearch] = useState('')
  const [groupChatName, setGroupChatName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSearch = async (e) => {
    const { value } = e.target
    setSearch(value)
    if (!value) return
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await Server.get(`/user?searchBy=${search}`, config)
      setLoading(false)
      setSearchResults(data.data)
    } catch (e) {
      console.log(e.message)
      toast({
        title: 'Error Occurred',
        status: 'error',
        duration: 5000,
        position: 'bottom-right',
        isClosable: true
      })
    }
  }



  const handleSubmit = async(e) => {
    e.preventDefault()
    if(!groupChatName || !selectedUsers){
      toast({
        title : 'Please fill all the fields',
        status : 'warning',
        duration : 5000,
        isClosable : true,
        position : 'top'
      })
      return 
    }
    try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    const postData = {
      name : groupChatName,
      users : JSON.stringify(selectedUsers.map(user => user._id))
    }
    const {data} = await Server.post(`/chat/group`,postData, config)
    setChats(prevState => ([data.data,...prevState]))
    onClose()
    setSelectedUsers([])
    setGroupChatName('')
    setSearch('')
    toast({
      title : data.message,
      duration : 5000,
      isClosable : true,
      position : 'bottom',
      status : "success"
    })
  }
  catch(e){
    toast({
      title : "Error Occured",
      duration : 5000,
      isClosable : true,
      position : 'bottom',
      status : "error"
    })
    console.log(e)
  }
  } 

  const handleChatClick = (user) => {
    if(selectedUsers.includes(user)){
      toast({
        title : 'user is already selected',
        status: 'warning',
        duration : 5000,
        isClosable:true,
        position : 'top'
      })
      return 
    }else {
      setSelectedUsers(prevState => ([user,...prevState]))
    }
  }

  const handleDeleteBadge = (userToDelete) => {
    setSelectedUsers(prevState => prevState.filter(user => user !== userToDelete))
  }



  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader
            fontSize="25px"
            display="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            flexDir="column"
            gap={4}
          >
            <FormControl isRequired>
              <Input
                type="text"
                placeholder="Enter Chat Name"
                name="groupChatName"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            
            <FormControl isRequired>
              <Input
                type="text"
                placeholder="Search users to add"
                name="search"
                value={search}
                onChange={handleSearch}
              />
            </FormControl>
            <Box display="flex" width="100%" flexWrap="wrap">
    {selectedUsers.map(user => (
      <UserBadgeItem key={user._id} user={user} onDelete={handleDeleteBadge}/>
    ))}
</Box>
            <>
              {loading ? <div>loading...</div> :
               <>
               {searchResults.slice(0, 4).map(user => (
                <UserListItem user={user} key={user._id} handleClick={() => handleChatClick(user)}/>
              )
              )}
              </>
              }
            </>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal