import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'
import React, { useState } from 'react'
import axios from 'axios'
import Server from '../../utils/Server'
const Signup = () => {
    const toast = useToast()
    const Navigator = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        password: '',
        email: '',
        confirmPassword: '',
    })
    const [picture, setPicture] = useState("")
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)


    const handlePictureSelect = async (e) => {
        const pic = e.target.files[0]
        if (!pic) {
            toast({
                title: "Please Select an Picture",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        try {
            setLoading(true)
            if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
                const data = new FormData()
                data.append('file', pic)
                data.append('upload_preset', 'chaton')
                data.append('cloud_name', "dharmic-chaton")
                const { data: res_data } = await axios.post('https://api.cloudinary.com/v1_1/dharmic-chaton/image/upload', data)
                const picture = res_data.url.toString()
                setPicture(picture)
                setLoading(false)
            }
            else {
                toast({
                    title: "Please Select an Picture",
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                })
            }
        }
        catch (e) {
            console.log(e.message)
            toast({
                title: "Error Occured while uploading picture",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }



    const handleShowClick = () => {
        setShow(prevState => !prevState)
    }

    const handleChange = (e) => {
        const { name, value,type,files } = e.target
        setFormData(prevState => ({ ...prevState, [name]:type === "file" ? files[0] : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const {email,password,confirmPassword,name} = formData
        if(!email || !name){
            return toast({
                status : 'warning',
                title : 'Please fill all required fields',
                duration : 5000,
                isClosable : true,
                position: 'bottom'
            })
        }

        if(password !== confirmPassword){
            return toast({
                status : 'warning',
                title : "Password did'nt matched",
                duration : 5000,
                isClosable : true,
                position: 'bottom'
            })
        }
        try{
        setLoading(true)
        const shouldAddPicture = picture.length > 0 ? picture : undefined
        const res = await Server.post('/user/signup', { ...formData, picture:shouldAddPicture })
        toast({
            title : "Registration Successful",
            status:"success",
            isClosable : true,
            duration : 5000,
            position:'bottom'
        })
        localStorage.setItem('user',JSON.stringify(res.data))
        setLoading(false)
        Navigator('/chats')
        }
        catch(e){
                toast({
                    title : 'Error Occured',
                    description : e.response.data.message,
                    duration:5000,
                    isClosable : true,
                    position : 'bottom'
                })
        }
    }

    return (
        <VStack spacing="5px">
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    type="text"
                    placeholder="Enter Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </FormControl>
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
                            {show ? "Hide" : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm Your Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                            {show ? "Hide" : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="picture">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    b="0"
                    style={{ border: 0, padding: "0 0 0 2px" }}
                    outline={0}
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={handlePictureSelect}
                />
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
        </VStack>
    )
}

export default Signup