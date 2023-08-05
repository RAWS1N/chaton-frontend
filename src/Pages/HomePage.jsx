import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, Text,Tabs, TabPanels, TabPanel } from '@chakra-ui/react'
import Login  from '../components/Authantication/Login'
import Signup from '../components/Authantication/Signup'
import { useNavigate } from 'react-router-dom'
import { ChatState } from '../Context/ChatProvider'



const HomePage = () => {
  const Navigator = useNavigate()
  const {user} = ChatState()
  useEffect(() => {
    if(user){
      Navigator('/chats')
    }
  },[user])

  return (
    <Container maxW='xl' centerContent={true}>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text textAlign="center" fontSize="2xl" fontFamily='Work Sans'>Chat-On</Text>
      </Box>
      <Box bg="white" p={4} w="100%" borderRadius="lg" borderWidth="1px">
      <Tabs variant='soft-rounded' >
  <TabList mb="1em">
    <Tab w="50%">Login</Tab>
    <Tab w="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>
    </Container>
  )
}

export default HomePage