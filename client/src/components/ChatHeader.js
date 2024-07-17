import React from 'react'
import { Box } from '@mui/material';
import Friend from './Friend';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import Contact from 'components/Contact';

export default function ChatHeader({userId}) {
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState(null);

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
        console.log(data);
      };
    
      useEffect(() => {
        getUser();
    
      }, [userId]);
    
      if (user === null) {
        return null; // or display a loading state
      }
      const { firstName, lastName, occupation, picturePath } = user;
  return (
    <>
    <Box display="flex" flexDirection="column" gap="1.5rem">
    <Contact
      key={userId}
      friendId={userId}
      name={`${firstName} ${lastName}`}
      subtitle={occupation}
      userPicturePath={picturePath}
      selectedUserId={""}
    />
  </Box>
    </>
  )
}
