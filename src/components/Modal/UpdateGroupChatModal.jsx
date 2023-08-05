import React, { useState } from 'react'
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserListItem from '../userAvatar/UserListItem'
import UserBadgeItem from '../UserBadgeItem'
import Server from '../../utils/Server'

function UpdateGroupChatModal({ fetchAgain, setFetchAgain,fetchMessages }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedChat, setSelectedChat, user } = ChatState()
    const [search, setSearch] = useState('')
    const [groupChatName, setGroupChatName] = useState('')
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const toast = useToast()

    const handleRemoveUser = async(userToRemove) => {
        const alreadyIn = selectedChat.users.find(user => user._id === userToRemove._id)
        if(!alreadyIn){
            toast({
                title : 'User Already removed from group',
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'top'
            })
            return
        }

        const removeCondition = selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id
        if(removeCondition){
            toast({
                title: "Only admin can remove user",
                status : 'error',
                duration : 5000,
                position : 'top',
                isClosable : true
            })
            return 
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }
              const postData = {
                chatId : selectedChat._id,
                userId : userToRemove._id
              }
              const {data} = await Server.post(`/chat/remove`,postData, config)
              userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data.data)
              setFetchAgain(prevState => !prevState)
              fetchMessages()
              setLoading(false)
        }
        catch(e){
            toast({
                title: "Error Occured",
                status : 'error',
                duration : 5000,
                position : 'top',
                isClosable : true
            })
            console.log(e)
        }
    }

    const handleAddUser = async(userToAdd) => {
        const alreadyIn = selectedChat.users.find(user => user._id === userToAdd._id)
        if(alreadyIn){
            toast({
                title : 'User Already exist in group',
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'top'
            })
            return
        }

        const isAdmin = selectedChat.groupAdmin._id === user._id
        if(!isAdmin){
            toast({
                title: "Only admin can add user",
                status : 'error',
                duration : 5000,
                position : 'top',
                isClosable : true
            })
            return 
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }
              const postData = {
                chatId : selectedChat._id,
                userId : userToAdd._id
              }
              const {data} = await Server.post(`/chat/add`,postData, config)
              setSelectedChat(data.data)
              setFetchAgain(!fetchAgain)
              setLoading(false)
        }
        catch(e){
            toast({
                title: "Error Occured",
                status : 'error',
                duration : 5000,
                position : 'top',
                isClosable : true
            })
            setLoading(false)
            console.log(e)
        }

    }

    const handleRename = async() => {
        if(!groupChatName){
            toast({
                title:"Please Add Group Chat Name",
                status : 'warning',
                position:'top',
                duration:5000,
                isClosable:true
            })
            return 
        }

        try{
            setRenameLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }
              const postData = {
                chatId : selectedChat._id,
                chatName : groupChatName
              }
              const {data} = await Server.post(`/chat/rename`,postData, config)
              setSelectedChat(data.data)
              setRenameLoading(false)
              setFetchAgain(prevState => !prevState)
              
        }
        catch(e){
            toast({
                title : 'Error Occured',
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'top'
            })
            console.log(e)
        }
        finally{
            setGroupChatName('')
        }
    }

    const handleSearch = async (e) => {
        const { value } = e.target
        setSearch(value)
        if (!value) {
            setSearchResults([])
            return 
        }
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
    

    return (
        <>
            <IconButton
                onClick={onOpen}
                display={{ base: 'flex' }}
                icon={<ViewIcon />}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="28px"
                        display="flex"
                        justifyContent='center'
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display="flex" flexWrap="wrap" width="100%" pb={3}>
                            {selectedChat.users.map(user => <UserBadgeItem
                                key={user._id}
                                user={user}
                                onDelete={handleRemoveUser}
                            />)}
                        </Box>
                        <FormControl display="flex" gap={3} isRequired>
                            <Input
                                type="text"
                                placeholder="Enter Chat Name"
                                name="groupChatName"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            
                            >Update</Button>
                        </FormControl>
            <FormControl isRequired mb={3}>
              <Input
                type="text"
                placeholder="Search users to add"
                name="search"
                value={search}
                onChange={(e) => handleSearch(e)}
              />
            </FormControl>
            <>
            {loading ? <Spinner size="lg"/> : <>
                {searchResults.map(user => <UserListItem key={user._id} user={user} handleClick={() => handleAddUser(user)}/>)}
                                
            </>}
            </>
                    </ModalBody>

                    <ModalFooter>
                        <Button background='#E74C3C' color="white" mr={3} onClick={() => handleRemoveUser(user)}>
                            Leave Group
                        </Button>
                        
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal