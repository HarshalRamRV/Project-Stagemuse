import { Box } from "@mui/material";
import { styled } from "@mui/system";

const ScrollWidgetWrapper = styled(Box)(({ theme }) => ({
  scrollbarWidth:"0.1px",
  overflowY:"scroll",
  "&::-webkit-scrollbar": {
    width: "0px",
  },

  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.alt,
  },

  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "5px",
  },

  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
}));

export default ScrollWidgetWrapper;