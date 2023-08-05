import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react'


function UserListItem({user,handleClick}) {
  return (
    <Box 
        onClick={handleClick}
        cursor="pointer"
        background="#e8e8e8"
        overflow="hidden"
        whiteSpace="nowrap"
        _hover = {{
            background:"#38B2AC",
            color : 'white'
        }}
        width="100%"
        display='flex'
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
    >
        <Avatar
            mr={2}
            size="sm"
            cursor="pointer"
            name={user.name}
            src={user.picture}
        />
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize="xs" textOverflow="ellipsis"><b>Email:</b>{user.email}</Text>
        </Box>

    </Box>
  )
}

export default UserListItem