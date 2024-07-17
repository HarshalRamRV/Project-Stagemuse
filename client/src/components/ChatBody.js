import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Typography, useTheme } from "@mui/material";
import { Box } from "@mui/material";
import FlexBetween from "./FlexBetween";
import ScrollWidgetWrapper from "./ScrollWidgetWrapper";
import { io } from "socket.io-client"; // Import socket instance

const ChatBody = ({ receiverId, senderId }) => {
  const token = useSelector((state) => state.token);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  // Theme config
  const theme = useTheme();
  const main = theme.palette.neutral.main;
  const mediumLight = theme.palette.neutral.mediumLight;
  const neutralMedium = theme.palette.neutral.medium;
  const primaryLight = theme.palette.primary.light;

  const chatEndRef = useRef(null);   // Create a ref to the last message element

  
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/messages/${senderId}/${receiverId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      console.log("data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };

  useEffect(() => {
    const socket = io.connect("http://localhost:3001"); // Initialize socket instance

    socket.on("newMessage", async (message) => {
      // Update messages only if the received message is relevant
      if (
        (message.senderId === senderId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === senderId)
      ) {
        const data = await fetchMessages();
        setMessages(data);
      }
    });

    return () => {
      socket.disconnect(); // Disconnect socket when component unmounts
    };
  }, [receiverId, senderId]);

  useEffect(() => {
    if (receiverId) {
      fetchMessages().then((data) => {
        setMessages(data);
      });
    }
  }, [receiverId]);

  useEffect(() => {
    // ... (existing useEffect code)

    // Scroll to the latest message when messages are updated
    if (messages.length > 0 && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const renderDateHeader = (date) => {
    const currentDate = new Date();
    const messageDate = new Date(date);
  
    const isSameDay = (
      currentDate.getDate() === messageDate.getDate() &&
      currentDate.getMonth() === messageDate.getMonth() &&
      currentDate.getFullYear() === messageDate.getFullYear()
    );
  
    let dateHeaderText;
  
    if (isSameDay) {
      dateHeaderText = "Today";
    } else {
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
  
      if (
        yesterday.getDate() === messageDate.getDate() &&
        yesterday.getMonth() === messageDate.getMonth() &&
        yesterday.getFullYear() === messageDate.getFullYear()
      ) {
        dateHeaderText = "Yesterday";
      } else {
        dateHeaderText = messageDate.toLocaleDateString();
      }
    }
  
    return (
      <FlexBetween
        display="flex"
        flexDirection="column"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          borderRadius="1rem"
          variant="caption"
          color={neutralMedium}
          borderColor={neutralMedium}
          border="thin solid"
          sx={{ fontSize: "0.7rem", textAlign: "center" }}
          padding="0.3rem 1rem"
        >
          <Box>
            {dateHeaderText}
          </Box>
        </Typography>
      </FlexBetween>
    );  };
  

  return (
    <ScrollWidgetWrapper height="60vh" display="flex" flexDirection="column">
      {!receiverId ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          fontSize="2rem"
          sx={{ color: mediumLight }}
        >
          Select a friend to message
        </Box>
      ) : (
        <Box>
          {messages.map((msg, index) => {
            const currentDate = new Date();
            const messageDate = new Date(msg.createdAt);
            const prevMessage = messages[index - 1];
            const prevMessageDate = prevMessage
              ? new Date(prevMessage.createdAt)
              : null;

            const showDateHeader =
              !prevMessageDate ||
              messageDate.toDateString() !== prevMessageDate.toDateString();

            return (
              <Box
                key={index}
                display="flex"
                flexDirection={
                  msg.receiverId !== receiverId ? "" : "row-reverse"
                }
                flexWrap="wrap"
                ref={index === messages.length - 1 ? chatEndRef : null}
              >
                {showDateHeader && renderDateHeader(messages[index].createdAt)}
                <FlexBetween
                  style={{ wordBreak: "break-all", position: "relative" }}
                  overflow="hidden"
                  flexWrap="wrap"
                  maxWidth="30vw"
                  marginY="1vh"
                  backgroundColor={
                    msg.receiverId !== receiverId ? mediumLight : primaryLight
                  }
                  borderRadius="9px"
                  gap="0rem"
                  padding="0.5rem 1rem"
                >
                  <Box paddingRight="1vw">{msg.text}</Box>
                  <Typography
                    color={main}
                    variant="caption"
                    sx={{
                      fontSize: "0.6rem",
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </FlexBetween>
              </Box>
            );
          })}
        </Box>
      )}
    </ScrollWidgetWrapper>
  );
};

export default ChatBody;
