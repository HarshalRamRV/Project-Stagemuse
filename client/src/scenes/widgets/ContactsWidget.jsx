import { Box, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import FlexBetween from "components/FlexBetween"
import Contact from "components/Contact";
import ScrollWidgetWrapper from "components/ScrollWidgetWrapper";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FixedHeading = styled(Typography)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.alt,
  padding: "1rem",
}));

const ContactsWidget = ({ userId, GetSelectedUser }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [selectedUserId, setSelectedUserId] = useState();

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const selectFriend = (userId) => {
    setSelectedUserId(userId); // Update selectedUserId state when a friend is selected
    GetSelectedUser(userId); // Call the callback function in the parent with the selectedUserId
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper height="100%">
      <FixedHeading
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </FixedHeading>
      <ScrollWidgetWrapper maxHeight="59vh">
      <Box display="flex" flexDirection="column" gap="1.5rem">
      {friends && friends.length > 0 ? (friends.map((friend) => (
        <Box 
        onClick={() => {selectFriend(friend._id);}}>
        <Contact
          selectedUserId={selectedUserId}
          key={friend._id}
          friendId={friend._id}
          name={`${friend.firstName} ${friend.lastName}`}
          subtitle={friend.occupation}
          userPicturePath={friend.picturePath}
        />
        </Box>
      ))):(""
      )}
    </Box>
      </ScrollWidgetWrapper>
    </WidgetWrapper>
  );
};

export default ContactsWidget;
