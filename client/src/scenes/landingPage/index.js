import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import Section1 from "../../components/Section1";

const LandingPage = () => {
  const theme = useTheme();
  return (
    <div>
      {/* Navbar */}
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography
          fontWeight="bold"
          fontStyle="italic"
          fontSize="32px"
          color="primary"
          sx={{
            textTransform: "uppercase",
          }}
        >
          Stagemuse Fashion
        </Typography>
      </Box>      {/* Sections */}
      <Section1 />

    </div>
  );
};

export default LandingPage;

