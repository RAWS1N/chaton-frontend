import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'
import Server from '../../utils/Server'
import { ChatState } from '../../Context/ChatProvider'

const Login = () => {
    const [formData, setFormData] = useState({
        password: '',
        email: '',
    })
    const [show,setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const Navigator = useNavigate()
    const {setNotification} = ChatState()
    const toast = useToast()
    const handleShowClick = () => {
        setShow(prevState => !prevState)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({ ...prevState, [name]:value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const {email,password} = formData
        if(!email || !password){
             toast({
                status : 'warning',
                title : 'Please fill all required fields',
                duration : 5000,
                isClosable : true,
                position: 'bottom'
            })
            return 
        }
        try{
            setLoading(true)
        const res = await Server.post('/user/signin', formData)
        toast({
            title : "Logged In Successfuly",
            status:"success",
            isClosable : true,
            duration : 5000,
            position:'bottom'
        })
        localStorage.setItem('user',JSON.stringify(res.data))
        setNotification(res.data.notification)
        setLoading(false)
        Navigator('/chats')
        }
        catch(e){
            console.log(e)
            setLoading(false)
                toast({
                    title : 'Error Occured',
                    description :"",
                    duration:5000,
                    isClosable : true,
                    position : 'bottom'
                })
        }
    }

    const loginAsGuest = () => {
        setFormData({email:'guest@gmail.com',password:'guest#2023'})
    }
    return (
        <VStack spacing="5px">
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter Your Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? "text" : "password"}
                            placeholder="Enter Your Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                         <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                            {show ? "Hide":'Show'}
                        </Button>
                        </InputRightElement>
                   </InputGroup>
                </FormControl>   
                <Button 
                  colorScheme='blue' 
                  width="100%" 
                  mt="15px" 
                  onClick={handleSubmit}
                  isLoading={loading}
                >
                Submit
                </Button>
                <Button 
                variant='solid'
                  colorScheme='red' 
                  width="100%" 
                  mt="0px" 
                  onClick={loginAsGuest}
                >
                Get Guest User Credentials
                </Button>
        </VStack>
    )
}


export default Login
