import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, ListItem, Menu, MenuButton, MenuDivider, MenuItem, MenuList,  Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from '../Modal/ProfileModal'
import { useNavigate } from 'react-router-dom'
import Server from '../../utils/Server'
import ChatLoading from './ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
import { Spinner } from '@chakra-ui/spinner'
import { getSender, getSenderFull } from '../../utils/ChatLogic'

const SideDrawer = () => {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const { user, setUser,setSelectedChat,setChats,chats,notification,setNotification } = ChatState()
    const Navigator = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const logoutUser = () => {
        localStorage.removeItem("user")
        setUser("")
        Navigator("/")
    }


    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter Something to Search",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
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
            const { data } = await Server.get(`/user?searchBy=${search}`, config)
            setLoading(false)
            setSearchResult(data.data)
        }
        catch (e) {
            toast({
                title: 'Error Occurred',
                status: 'error',
                duration: 5000,
                position: 'bottom-right',
                isClosable: true
            })
        }
    }

    const accessChat = async (id) => {
        try{
            setLoadingChat(true)
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        const {data} = await Server.post(`/chat`,{
            userId:id
        },config)
        if(!chats.find(chat => chat._id === data._id)) setChats(prevState => ([data,...prevState]))
        setLoadingChat(false)
        setSelectedChat(data.data)
        onClose()
    } catch(e) {
        setLoadingChat(false)
        toast({
            title: 'Error Occurred',
            status: 'error',
            duration: 5000,
            position: 'bottom-right',
            isClosable: true
        })
    }
    }

    const removeNotification = async(message) => {
        try{
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
          
          const postData = {
            message_id : message._id,
            user_id : user._id
          }
          const {data} = await Server.post(`/user/notification`,postData, config)
          console.log(data)
        }catch(e){
            console.log(e)
        }
        
      }




    return (
        <div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems='center'
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"

            >
                <Tooltip label="Search users to chat" hasArrow placement='bottom-end'>

                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: 'none', md: 'flex' }} px="4">Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl">ChatOn</Text>
                <div>
                    <Menu>
                        <MenuButton p='1'>
                            <div style={{position:'relative'}}>
                            <BellIcon fontSize={{base:"2xl",md:"3xl"}} m={1}/>
                            {notification.length > 0 && (<div style={{position:"absolute",height:'16px',width:'16px',borderRadius:'50%',top:0,right:"2px",background:"red",textAlign:'center',color:"white",fontSize:"11px"}}>{notification.length}</div>)}
                            </div>
                        </MenuButton>
                        <MenuList paddingBlock={1}>
                            {notification.length > 0 ? <>
                                {notification.map(notif => (
                                    <MenuItem key={notif._id} onClick={async() => {
                                        setSelectedChat(notif?.chat)
                                        setNotification(prevState => prevState.filter(n => n !== notif))
                                        await removeNotification(notif)
                                        }}
                                        m={0} 
                                        paddingInline={2} 
                                        paddingBlock={2}>
                                    {notif?.chat?.isGroupChat ? `New Message in ${notif?.chat?.chatName}`:`New Message from ${getSender(user,notif?.chat?.users)}`}
                                    </MenuItem>
                                    
                                ))}
                            </> : <p style={{paddingInline:"12px"}}>No New Message</p>}
                        </MenuList>
                    </Menu>
                    <Menu >
                        <MenuButton as={Button} p={3} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.picture} />
                        </MenuButton>
                        <MenuList p={1}>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider p={0} m={1.5} />
                            <MenuItem onClick={logoutUser}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">
                        Search Users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                name="search"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? <ChatLoading /> : (
                            <>
                                {searchResult.map(user => {
                                   return ( <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleClick={() => accessChat(user._id)}
                                    />)
                                })}

                            </>
                        )}
                        {loadingChat ? <Spinner ml="auto" display="flex"/>:null}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideDrawer