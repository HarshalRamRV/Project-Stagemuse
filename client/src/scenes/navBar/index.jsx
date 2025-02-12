import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  Logout,
  Home,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <FlexBetween
        padding="1rem 6%"
        backgroundColor={alt}
        position="fixed"
        top="0"
        width="100%"
        zIndex="1"
      >
        <FlexBetween gap="1.75rem">
          <Typography
            fontWeight="bold"
            fontStyle="italic"
            fontSize="clamp(1rem, 1.5rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{
              textTransform: "uppercase",
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            Stagemuse Fashion
          </Typography>
          {false && (
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase placeholder="Search..." />
              <IconButton>
                <Search />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>

        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <Home
              onClick={() => navigate(`/home/`)}
              sx={{ fontSize: "25px" }}
            />
            <Message
              onClick={() => navigate(`/messages/`)}
              sx={{ fontSize: "25px" }}
            />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <></>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && (
          <Box
            position="fixed"
            left="0"
            bottom="0"
            width="100%"
            zIndex="10"
            backgroundColor={background}
            boxShadow="0px -2px 6px rgba(0, 0, 0, 0.1)"
            borderTop="1px solid rgba(0, 0, 0, 0.1)"
            marginBottom="-2px"
          >
            <FlexBetween
              display="flex"
              justifyContent="space-around"
              alignItems="center"
              padding="0.5rem 10vw"
            >
              <IconButton sx={{ fontSize: "25px" }}>
                <Home onClick={() => navigate(`/home`)} />
              </IconButton>
              <IconButton sx={{ fontSize: "25px" }}>
                <Message onClick={() => navigate(`/messages/`)} />
              </IconButton>
              <IconButton sx={{ fontSize: "25px" }}>
                <Logout onClick={() => dispatch(setLogout())} />
              </IconButton>
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
      <Box py="2rem"></Box>
    </>
  );
};

export default Navbar;
