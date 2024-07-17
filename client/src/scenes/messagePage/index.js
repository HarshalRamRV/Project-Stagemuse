import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navBar";
import { useSelector } from "react-redux";
import ContactsWidget from "scenes/widgets/ContactsWidget";
import Chat from "components/Chat";

export default function MessagePage() {
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const selectedUser = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="4vh 4vw"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1rem"
        justifyContent="space-between"
      >
        <Box flexBasis="26%" minHeight="80vh">
          <ContactsWidget
            userId={_id}
            GetSelectedUser={selectedUser}
          />
        </Box>
        <Box flexBasis="74%" minHeight="80vh">
          <Chat userId={selectedUserId} _id={_id} />
        </Box>
      </Box>
    </Box>
  );
}
