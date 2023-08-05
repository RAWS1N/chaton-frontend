import { Box } from '@chakra-ui/react'
import {CloseIcon} from '@chakra-ui/icons'
import React from 'react'

function UserBadgeItem({user,onDelete}) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      color="white"
      display="flex"
      alignItems="center"
      background="purple"
      cursor="pointer"
      onClick={() => onDelete(user)}
    >
      {user.name}
      <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem