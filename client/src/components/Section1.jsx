import {
  Box,
  Container,
  Stack,
  Card,
  CardActionArea,
  CardContent,
  useMediaQuery,
  Button,
  useTheme,
} from "@mui/material";
import React from "react";
import { section1Content } from "../utils/content";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
const { MainBG, title, subtitle } = section1Content;

const Section1 = () => {
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <img
          src={MainBG}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            right: 0,
            left: 0,
          }}
          alt=""
        />
      </Box>

      {/* Content */}
      <Container
        sx={{
          height: "75vh",
          margin: "0",
        }}
      >
        <Stack
          sx={{ height: "80%", marginRight: "15%" }}
          justifyContent="center"
        >
          <Title
            // variant={{xl:"h1", md:"h2", sm:"h3"}}
            sx={{
              letterSpacing: "0.02em",
              mb: 1,
              textAlign: "center",
              fontSize: "calc(2vw + 2vh + 1vmin);",
            }}
          >
            {title}
          </Title>

          <Title
            sx={{
              fontWeight: 100,
              letterSpacing: "0.05em",
              textAlign: "center",
              mb: 3,
              fontSize: "calc(1vw + 1vh + 1vmin);",
            }}
          >
            {subtitle}
          </Title>
          <Title
            sx={{
              fontStyle: "italic",
              fontWeight: 100,
              letterSpacing: "0.05em",
              textAlign: "center",
              mb: 3,
              fontSize: "calc(0.7vw + 0.7vh + 1vmin);",
            }}
          >
            <span style={{ color: "#FF6AC1" }}>#CLEAN</span>{" "}
            <span style={{ color: "#FF4DFF" }}>#VIBRANT</span>{" "}
            <span style={{ color: "#B993FF" }}>#EXCITING</span>{" "}
          </Title>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Button
              onClick={() => {
                navigate("/");
              }}
              sx={{
                color: theme.palette.background.alt,
                backgroundColor: theme.palette.primary.main,
                fontWeight: 500,
                borderRadius: "3rem",
                padding: "0.8rem 4.4rem",
                marginX: "1rem",
                fontSize: isNonMobileScreens? "1rem" : "1em",
              }}
            >
              Login Now
            </Button>
          </Box>
        </Stack>
        <Box display={"flex"}>
          {isNonMobileScreens
            ? featuresData.items.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    maxWidth: 345,
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    p: 0.5,
                    mx: 2,
                  }}
                >
                  <CardActionArea>
                    <CardContent>
                      <Title variant={{ xs: "h3", sm: "h2" }}>
                        {item.title}
                      </Title>
                      <Title variant="h5" color="text.secondary">
                        {item.subtitle}
                      </Title>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))
            : ""}
        </Box>
      </Container>
    </Box>
  );
};

export default Section1;
const featuresData = {
  items: [
    {
      title: "Podcasts",
      subtitle:
        "Explore fashion trends and industry insights through our audio content.",
    },
    {
      title: "Vlogs",
      subtitle:
        "Immerse in the world of fashion with visually captivating content.",
    },
    {
      title: "Blogs",
      subtitle:
        "Read articles on the ever-evolving landscape of fashion, filled with insightful commentary.",
    },
    {
      title: "Live Events",
      subtitle:
        "Join us for real-time fashion experiences, witness trends on the runway, and engage with experts.",
    },
  ],
};
