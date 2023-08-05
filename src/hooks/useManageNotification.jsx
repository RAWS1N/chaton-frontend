import React from 'react'
import { ChatState } from '../Context/ChatProvider'

function useManageNotification() {
  const {notification,setNotification} = ChatState()
  
  const ManageNotification = (message) => {
    const sender = message?.sender?.name
    console.log(sender)
    console.log(notification)
    if(sender){
      const notificationContained = notification.find(item => item.sender.name.toLowerCase() == sender.toLowerCase())
      console.log(notificationContained)
      if (!notificationContained) {
        setNotification(prevState => ([message, ...prevState]))
    }
    }
  }
  return ManageNotification
}

export default useManageNotification