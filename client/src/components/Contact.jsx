import React, { useEffect, useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Contact = ({ friendId, name, subtitle, userPicturePath, selectedUserId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [unreadCount, setUnreadCount] = useState(0); 
  const { palette } = useTheme();
  const primaryMain = palette.primary.main;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  useEffect(() => {
    const fetchUnreadMessageCount = async () => {
      try {
        console.log("Fetching unread message count...");
        const response = await fetch(`http://localhost:3001/messages/unread-counts/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setUnreadCount(data.unreadCount); // Update the unreadCount state
      } catch (error) {
        console.error("Error fetching unread message count:", error);
      }
    };
      fetchUnreadMessageCount();
  }, [friendId, selectedUserId, _id, token]);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };
  const isCurrentUserPost = _id === friendId;

  return (
    <FlexBetween 
      padding=".5vw"
      borderRadius="5px"
      sx={{              
        ...(selectedUserId === friendId && {
          background: palette.neutral.light,
          fontWeight: "bold",
        }),
      }}
    >
      <FlexBetween gap="1rem" >
        <UserImage image={userPicturePath} size="55px" />
        <Box>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {unreadCount > 0 && ( // Display the unread message indicator if unreadCount is greater than 0
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryMain, p: "0.6rem" }}
        >
          {/* You can place an unread message icon here, e.g., a dot or a number */}
          {unreadCount}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Contact;
