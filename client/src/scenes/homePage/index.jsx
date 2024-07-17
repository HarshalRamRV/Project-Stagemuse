import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navBar";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={"block"}
        gap="0.5rem"
        justifyContent="center"
      >
        <Box display="flex" justifyContent="center" mt={isNonMobileScreens ? undefined : "0rem"}>
          <Box flexBasis={isNonMobileScreens?"50%":undefined}>
            <MyPostWidget userId={_id} picturePath={picturePath} />
            <Box m="2rem 0" />
          </Box>

        </Box>
        <PostsWidget userId={_id} />
      </Box>
    </Box>
  );
};

export default HomePage;
