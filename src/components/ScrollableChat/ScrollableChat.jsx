import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../utils/ChatLogic'
import { ChatState } from '../../Context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

function ScrollableChat({messages}) {
    const {user} = ChatState()
    
  return (
    <ScrollableFeed>
        {messages.map((message,idx) => (
            <div style={{display:'flex'}} key={message._id}>
                {(isSameSender(messages,message,idx,user._id) || isLastMessage(messages,idx,user._id))&&(
                    <Tooltip
                        label={message.sender.name}
                        placement='bottom-start'
                        hasArrow={true}
                    >
                        <Avatar
                            name={message.sender.name}
                            src={message.sender.picture}
                            cursor="pointer"
                            size="sm"
                            mt="7px"
                            mr={1}
                        />
                    </Tooltip>
                )}

                <span style={
                    {background:`${message.sender._id === user._id ? "#BEE3f8": '#b9f5d0'}`,
                    borderRadius:"20px",
                    padding:"5px 15px",
                    justifySelf:"flex-start",
                    maxWidth:'75%',
                    marginLeft:isSameSenderMargin(messages,message,idx,user._id),
                    marginTop : isSameUser(messages,message,idx,user._id) ? 10 :3,
                    }}>{message.content}</span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat