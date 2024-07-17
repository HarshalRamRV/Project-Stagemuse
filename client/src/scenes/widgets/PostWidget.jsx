import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import ReactPlayer from "react-player";
import ReactAudioPlayer from "react-audio-player";
import DOMPurify from "dompurify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  thumbnailPicturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 500px)");

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const [openDialog, setOpenDialog] = useState(false);

  const isVideo = (path) => {
    if (path == null) return false;
    const videoExtensions = [".mp4", ".mov", ".webm"];
    const extension = path.substring(path.lastIndexOf(".")).toLowerCase();
    return videoExtensions.includes(extension);
  };

  const isAudio = (path) => {
    if (path == null) return false;
    const audioExtensions = [".mp3", ".wav"];
    const extension = path.substring(path.lastIndexOf(".")).toLowerCase();
    return audioExtensions.includes(extension);
  };

  const isImage = (path) => {
    if (path == null) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
    const extension = path.substring(path.lastIndexOf(".")).toLowerCase();
    return imageExtensions.includes(extension);
  };

  const openPostDialog = () => {
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <div onClick={() => openPostDialog()}>
        {picturePath ? (
          <>
            {isVideo(picturePath) ? (
              <Box
                width="100%"
                height={"30vh"}
                display={"flex"}
                backgroundImage={`http://localhost:3001/assets/${thumbnailPicturePath}`}
                backgroundSize={"cover"}
                backgroundPosition={"center"}
                borderRadius={"0.75rem"}
              >
                <ReactPlayer
                  url={`http://localhost:3001/assets/${picturePath}`}
                  light={
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img
                      src={`http://localhost:3001/assets/${thumbnailPicturePath}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "0.75rem",
                        objectFit: "cover",
                      }}
                    />
                  }
                  borderRadius="0.75rem"
                  width="100%"
                  height="auto"
                  style={{
                    borderRadius: "0.75rem",
                    margin: "1rem 0px",
                    border: `1.5px solid ${theme.palette.primary.light}`,
                  }}
                />
              </Box>
            ) : isAudio(picturePath) ? (
              <Box
                my="1.5vh"
                sx={{
                  height: "50vh",
                  border: `1.5px solid ${theme.palette.primary.light}`,
                  padding: "1.5rem 1.5rem 1.5rem 1.5rem",
                  backgroundImage: `linear-gradient(
                    rgba(0, 0, 0, 0.75), 
                    rgba(0, 0, 0, 0.75)
                  ),url(http://localhost:3001/assets/${thumbnailPicturePath})`,
                  borderRadius: "0.75rem",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Friend
                    friendId={postUserId}
                    name={name}
                    subtitle={location}
                    userPicturePath={userPicturePath}
                  />
                  <Typography color={main} sx={{ mt: "1rem" }}>
                    {description}
                  </Typography>
                </div>
                <ReactAudioPlayer
                  src={`http://localhost:3001/assets/${picturePath}`}
                  controls
                  style={{
                    borderRadius: "0.75rem",
                    marginTop: "0.75rem",
                    width: "100%",
                  }}
                />
              </Box>
            ) : isImage(picturePath) ? (
              <Box width="100%" marginTop="0.75rem">
                <LazyLoadImage
                  width="100%"
                  effect="blur"
                  height="auto"
                  alt="post"
                  style={{
                    border: `1.5px solid ${theme.palette.primary.light}`,
                    borderRadius: "0.75rem",
                  }}
                  src={`http://localhost:3001/assets/${picturePath}`}
                />
              </Box>
            ) : null}
          </>
        ) : (
          <Box
            my="1.5vh"
            sx={{
              height: "60vh",
              border: `1.5px solid ${theme.palette.primary.light}`,
              borderRadius: "0.75rem",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{
                borderRadius: "0.75rem",
                margin: "0",
              }}
              src={`http://localhost:3001/assets/${thumbnailPicturePath}`}
            />
            <Typography
              color={main}
              sx={{
                mt: "1rem",
                px: "1.5rem",
                maxHeight: "100%", // Set the maximum height for fade-out effect
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                position: "relative",
                backgroundImage:
                  "linear-gradient(to bottom, transparent, #0A0A0A 80%)", // Set the gradient
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 20%, transparent)", // Apply the gradient as a mask for WebKit browsers
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(description),
              }}
            />
          </Box>
        )}
      </div>

      <Dialog
        scroll={"body"}
        fullWidth
        maxWidth="md"
        style={{
          boxShadow: "none",
        }}
        PaperProps={{
          style: {
            borderRadius: "0.75rem",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            boxShadow: "none",
            margin: `${picturePath ? "" : "10vh"}`,
          },
        }}
        open={openDialog}
        transitionDuration={500}
        onClose={closeDialog}
      >
        {picturePath ? (
          <>
            {isVideo(picturePath) ? (
              <WidgetWrapper width="100%" padding="0.1rem 0px">
                <ReactPlayer
                  url={`http://localhost:3001/assets/${picturePath}`}
                  controls
                  playing="true"
                  width="100%"
                  height="auto"
                  style={{ borderRadius: "0.75rem", margin: "1rem 0px" }}
                />
              </WidgetWrapper>
            ) : isAudio(picturePath) ? (
              <Box
                sx={{
                  width: "100%",
                  height: isNonMobileScreens ? "75vh" : "50vh",
                  border: `1.5px solid ${theme.palette.primary.light}`,
                  padding: "1.5rem 1.5rem 1.5rem 1.5rem",
                  backgroundImage: `linear-gradient(
                  rgba(0, 0, 0, 0.75), 
                  rgba(0, 0, 0, 0.75)
                ),url(http://localhost:3001/assets/${thumbnailPicturePath})`,
                  borderRadius: "0.75rem",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Friend
                    friendId={postUserId}
                    name={name}
                    subtitle={location}
                    userPicturePath={userPicturePath}
                  />
                  <Typography color={main} sx={{ mt: "1rem" }}>
                    {description}
                  </Typography>
                </div>
                <ReactAudioPlayer
                  src={`http://localhost:3001/assets/${picturePath}`}
                  controls
                  style={{
                    borderRadius: "0.75rem",
                    marginTop: "0.75rem",
                    width: "100%",
                  }}
                />
              </Box>
            ) : isImage(picturePath) ? (
              <WidgetWrapper
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <img
                  alt="post"
                  src={`http://localhost:3001/assets/${picturePath}`}
                  style={{
                    borderRadius: "0.75rem",
                    maxWidth: isNonMobileScreens ? "100%" : "100%",
                    maxHeight: isNonMobileScreens ? "75vh" : "auto",
                  }}
                />
              </WidgetWrapper>
            ) : null}
          </>
        ) : (
          <WidgetWrapper
            sx={{
              width: "100%",
            }}
          >
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{
                borderRadius: "0.75rem",
                margin: "0",
              }}
              src={`http://localhost:3001/assets/${thumbnailPicturePath}`}
            />
            <Typography
              color={main}
              sx={{
                mt: "1rem",
                px: "1.5rem",
                maxHeight: "100%",
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(description),
              }}
            />
          </WidgetWrapper>
        )}
      </Dialog>
    </>
  );
};

export default PostWidget;
