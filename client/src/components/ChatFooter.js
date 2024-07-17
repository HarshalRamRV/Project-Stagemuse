import React, { useState } from 'react';
import { InputBase, IconButton, Box } from '@mui/material';
import { Send } from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';
import FlexBetween from './FlexBetween';
import { useTheme } from '@mui/material';
import { io } from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

const useStyles = makeStyles((theme) => ({
  input: {
    width: '100%', // Set your desired width value
  },
}));

export default function ChatFooter({ receiverId, senderId}) {
  const theme = useTheme();
  const [newMessage, setNewMessage] = useState('');
  const neutralLight = theme.palette.neutral.light;
  const classes = useStyles();

  const sendMessage = (e) => {
    e.preventDefault(); // Prevent form submission
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      const timestamp = new Date(); // Get the current timestamp
      socket.emit('message', {
        text: newMessage,
        senderId: senderId, // Replace with actual sender ID
        receiverId: receiverId, // Replace with actual receiver ID
        createdAt: timestamp.toISOString(), // Convert timestamp to ISO format
      });      

      setNewMessage('');
    }
  };

  return (
    <div>
      <form onSubmit={sendMessage}>
        <Box>
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="0rem"
            padding="0.1rem 1rem"
          >
            <InputBase
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={classes.input}
              color="primary"
              placeholder="Type a message..."
            />
            <IconButton type="submit">
              <Send />
            </IconButton>
          </FlexBetween>
        </Box>
      </form>
    </div>
  );
}
