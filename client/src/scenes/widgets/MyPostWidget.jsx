import React, { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PermMediaTwoTone,
  PhotoOutlined,
  Podcasts,
  TextSnippet,
  OndemandVideoOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill-styles.css";

const MyPostWidget = ({ userId, picturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [picture, setPicture] = useState("");
  const [vlog, setVlog] = useState("");
  const [podcast, setPodcast] = useState("");
  const [preview, setPreview] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const [unsupportedFormat, setUnsupportedFormat] = useState(false);
  const [thumbnailPicture, setThumbnailPicture] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUnsupportedFormat, setThumbnailUnsupportedFormat] =
    useState(false);
  const theme = useTheme();
  const [openBlogEditor, setOpenBlogEditor] = useState(false);
  const [blogContent, setBlogContent] = useState("");

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    if (picture) {
      formData.append("picture", picture);
      formData.append("picturePath", picture.name);
      formData.append("description", post);
    }
    if (vlog) {
      formData.append("picture", vlog);
      formData.append("picturePath", vlog.name);
      formData.append("thumbnailPicture", thumbnailPicture);
      formData.append("thumbnailPicturePath", thumbnailPicture.name);
      formData.append("description", post);
    }
    if (podcast) {
      formData.append("picture", podcast);
      formData.append("picturePath", podcast.name);
      formData.append("thumbnailPicture", thumbnailPicture);
      formData.append("thumbnailPicturePath", thumbnailPicture.name);
      formData.append("description", post);
    }
    if (blogContent) {
      formData.append("thumbnailPicture", thumbnailPicture);
      formData.append("thumbnailPicturePath", thumbnailPicture.name);
      formData.append("description", blogContent);
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setPicture(null);
    setVlog(null);
    setPodcast(null);
    setPreview(null);
    setPost("");
    setBlogContent("");
    setOpenBlogEditor(false); // Close the blog editor dialog
  };

  const handleBlogButtonClick = () => {
    setOpenBlogEditor(true);
    setPicture(null);
    setVlog(null);
    setPodcast(null);
    setPreview(null);
    setUnsupportedFormat(false);
    setThumbnailPicture(null);
    setThumbnailPreview(null);
    setThumbnailUnsupportedFormat(null);
  };

  const handleBlogEditorClose = () => {
    setOpenBlogEditor(false);
    setBlogContent(null);
    setThumbnailPicture(null);
    setThumbnailPreview(null);
    setThumbnailUnsupportedFormat(null);
  };

  const handleBlogEditorChange = (content) => {
    setBlogContent(content);
  };

  const handleImageUpload = (acceptedFiles) => {
    const selectedImage = acceptedFiles[0];
    if (isFileTypeValid(selectedImage, ["image/"])) {
      setUnsupportedFormat(false);
      setPicture(selectedImage);
      setPreview(URL.createObjectURL(selectedImage));
    } else {
      setUnsupportedFormat(true);
    }
  };

  const handleVideoUpload = (acceptedFiles) => {
    const selectedVideo = acceptedFiles[0];
    if (isFileTypeValid(selectedVideo, ["video/"])) {
      setUnsupportedFormat(false);
      setVlog(selectedVideo);
      setPreview(URL.createObjectURL(selectedVideo));
    } else {
      setUnsupportedFormat(true);
    }
  };

  const handleAudioUpload = (acceptedFiles) => {
    const selectedAudio = acceptedFiles[0];
    if (isFileTypeValid(selectedAudio, ["audio/"])) {
      setUnsupportedFormat(false);
      setPodcast(selectedAudio);
      setPreview(URL.createObjectURL(selectedAudio));
    } else {
      setUnsupportedFormat(true);
    }
  };

  const handleThumbnailImageUpload = (acceptedFiles) => {
    const selectedThumbnailImage = acceptedFiles[0];
    if (isFileTypeValid(selectedThumbnailImage, ["image/"])) {
      setThumbnailUnsupportedFormat(false);
      setThumbnailPicture(selectedThumbnailImage);
      setThumbnailPreview(URL.createObjectURL(selectedThumbnailImage));
    } else {
      setThumbnailUnsupportedFormat(true);
    }
  };

  const handleDeleteThumbnailMedia = () => {
    setThumbnailPicture(null);
    setThumbnailPreview(null);
  };

  const handleDeleteMedia = () => {
    setPicture(null);
    setVlog(null);
    setPodcast(null);
    setPreview(null);
  };
  const isFileTypeValid = (file) => {
    if (file) {
      const fileType = file.type;
      return (
        fileType.startsWith("image/") ||
        fileType.startsWith("audio/") ||
        fileType.startsWith("video/")
      );
    }
    return false;
  };
  return (
    <WidgetWrapper>
      <FlexBetween gap="1rem">
        <div onClick={() => navigate(`/profile/${userId}`)}>
          <UserImage image={picturePath} />
        </div>
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: ".75rem 2rem",
          }}
        />
      </FlexBetween>
      {picture && (
        <Box
          border={`1.5px solid ${palette.primary.light}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => handleImageUpload(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!preview ? (
                    <FlexBetween>
                      <p>Add Picture Here</p>
                      <IconButton sx={{ padding: "3%" }}>
                        <PermMediaTwoTone sx={{ color: mediumMain }} />
                      </IconButton>
                    </FlexBetween>
                  ) : (
                    <FlexBetween>
                      <Typography
                        noWrap
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "11rem",
                        }}
                      >
                        {picture.name}
                      </Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>

                {picture && (
                  <IconButton
                    onClick={handleDeleteMedia}
                    sx={{ padding: "3%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}
      {vlog && (
        <>
          <Box
            border={`1.5px solid ${palette.primary.light}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".mp4,.ogg,.webm"
              multiple={false}
              onDrop={(acceptedFiles) => handleVideoUpload(acceptedFiles)}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!preview ? (
                      <FlexBetween>
                        <p>Add Video Here</p>
                        <IconButton sx={{ padding: "3%" }}>
                          <PermMediaTwoTone sx={{ color: mediumMain }} />
                        </IconButton>
                      </FlexBetween>
                    ) : (
                      <FlexBetween>
                        <Typography
                          noWrap
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "11rem",
                          }}
                        >
                          {vlog.name}
                        </Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>

                  {vlog && (
                    <IconButton
                      onClick={handleDeleteMedia}
                      sx={{ padding: "3%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
          <Box
            border={`1.5px solid ${palette.primary.light}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) =>
                handleThumbnailImageUpload(acceptedFiles)
              }
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!thumbnailPreview ? (
                      <FlexBetween>
                        <p>Add Video Thumbnail Here</p>
                        <IconButton sx={{ padding: "3%" }}>
                          <PermMediaTwoTone sx={{ color: mediumMain }} />
                        </IconButton>
                      </FlexBetween>
                    ) : (
                      <FlexBetween>
                        <Typography
                          noWrap
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "11rem",
                          }}
                        >
                          {thumbnailPicture.name}
                        </Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>

                  {thumbnailPicture && (
                    <IconButton
                      onClick={handleDeleteThumbnailMedia}
                      sx={{ padding: "3%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        </>
      )}
      {podcast && (
        <>
          <Box
            border={`1.5px solid ${palette.primary.light}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png,.mp4,.ogg,.webm,.mp3,.wav"
              multiple={false}
              onDrop={(acceptedFiles) => handleAudioUpload(acceptedFiles)}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!preview ? (
                      <FlexBetween>
                        <p>Add Audio Here</p>
                        <IconButton sx={{ padding: "3%" }}>
                          <PermMediaTwoTone sx={{ color: mediumMain }} />
                        </IconButton>
                      </FlexBetween>
                    ) : (
                      <FlexBetween>
                        <Typography
                          noWrap
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "11rem",
                          }}
                        >
                          {podcast.name}
                        </Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>

                  {podcast && (
                    <IconButton
                      onClick={handleDeleteMedia}
                      sx={{ padding: "3%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
          <Box
            border={`1.5px solid ${palette.primary.light}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) =>
                handleThumbnailImageUpload(acceptedFiles)
              }
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!thumbnailPreview ? (
                      <FlexBetween>
                        <p>Add Audio Thumbnail Here</p>
                        <IconButton sx={{ padding: "3%" }}>
                          <PermMediaTwoTone sx={{ color: mediumMain }} />
                        </IconButton>
                      </FlexBetween>
                    ) : (
                      <FlexBetween>
                        <Typography
                          noWrap
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "11rem",
                          }}
                        >
                          {thumbnailPicture.name}
                        </Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>

                  {thumbnailPicture && (
                    <IconButton
                      onClick={handleDeleteThumbnailMedia}
                      sx={{ padding: "3%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        </>
      )}
      {unsupportedFormat && picture && (
        <Typography color="error" mt="0.5rem">
          Unsupported file format. Only image files are allowed.
        </Typography>
      )}
      {unsupportedFormat && vlog && (
        <Typography color="error" mt="0.5rem">
          Unsupported file format. Only video files are allowed.
        </Typography>
      )}
      {thumbnailUnsupportedFormat && vlog && (
        <Typography color="error" mt="0.5rem">
          Unsupported file format. Only image files are allowed for Thumbnail.
        </Typography>
      )}
      {unsupportedFormat && podcast && (
        <Typography color="error" mt="0.5rem">
          Unsupported file format. Only audio files are allowed.
        </Typography>
      )}
      {thumbnailUnsupportedFormat && podcast && (
        <Typography color="error" mt="0.5rem">
          Unsupported file format. Only image files are allowed for Thumbnail.
        </Typography>
      )}
      {preview && (
        <Box mt="1rem">
          {picture && (
            <img src={preview} alt="Preview" style={{ width: "100%" }} />
          )}
          {vlog && (
            <ReactPlayer
              url={preview}
              width="100%"
              height="auto"
              controls
              style={{ outline: "none" }}
            />
          )}
          {podcast && (
            <audio
              src={preview}
              controls
              style={{ outline: "none", width: "100%" }}
            />
          )}
        </Box>
      )}

      {thumbnailPreview && (
        <Box mt="1rem">
          {vlog && (
            <img
              src={thumbnailPreview}
              alt="Preview"
              style={{ width: "100%" }}
            />
          )}
          {podcast && (
            <img
              src={thumbnailPreview}
              alt="Preview"
              style={{ width: "100%" }}
            />
          )}
        </Box>
      )}
      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween>
          <FlexBetween
            pr="1rem"
            gap="0.25rem"
            onClick={() => {
              setPicture(!picture);
              setVlog(null);
              setPodcast(null);
              setPreview(null);
              setUnsupportedFormat(false);
            }}
          >
            <PhotoOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Picture
            </Typography>
          </FlexBetween>
          <FlexBetween
            pr="1rem"
            gap="0.25rem"
            onClick={() => {
              setPicture(null);
              setVlog(!vlog);
              setPodcast(null);
              setPreview(null);
              setUnsupportedFormat(false);
              setThumbnailPicture(null);
              setThumbnailPreview(null);
              setThumbnailUnsupportedFormat(null);
            }}
          >
            <OndemandVideoOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Vlog
            </Typography>
          </FlexBetween>
          <FlexBetween
            pr="1rem"
            gap="0.25rem"
            onClick={() => {
              setPicture(null);
              setVlog(null);
              setPodcast(!podcast);
              setPreview(null);
              setUnsupportedFormat(false);
              setThumbnailPicture(null);
              setThumbnailPreview(null);
              setThumbnailUnsupportedFormat(null);
            }}
          >
            <Podcasts sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Podcast
            </Typography>
          </FlexBetween>
          <FlexBetween pr="1rem" gap="0.25rem" onClick={handleBlogButtonClick}>
            <TextSnippet sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Blog
            </Typography>
          </FlexBetween>
        </FlexBetween>

        <Button
          disabled={post === "" && !preview}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
        <Dialog
          open={openBlogEditor}
          onClose={handleBlogEditorClose}
          fullWidth
          maxWidth="md"
          PaperProps={{
            style: {
              borderRadius: "0.75rem",
              boxShadow: "none",
              margin: "0",
              height: `${!thumbnailPreview?("68vh"):("87vh")}`,
              border: `1.5px solid ${theme.palette.primary.light}`,
            },
          }}
        >
          <DialogTitle>Write a Blog</DialogTitle>
          <DialogContent>
            <Box
              border={`1.5px solid ${palette.primary.light}`}
              borderRadius="5px"
              my="1rem"
              p="1rem"
            >
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) =>
                  handleThumbnailImageUpload(acceptedFiles)
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <FlexBetween>
                    <Box
                      {...getRootProps()}
                      p="1rem"
                      width="100%"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} />
                      {!thumbnailPreview ? (
                        <FlexBetween>
                          <p>Add Audio Thumbnail Here</p>
                          <IconButton sx={{ padding: "3%" }}>
                            <PermMediaTwoTone sx={{ color: mediumMain }} />
                          </IconButton>
                        </FlexBetween>
                      ) : (
                        <FlexBetween>
                          <Typography
                            noWrap
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "11rem",
                            }}
                          >
                            {thumbnailPicture.name}
                          </Typography>
                          <EditOutlined />
                        </FlexBetween>
                      )}
                    </Box>

                    {thumbnailPicture && (
                      <IconButton
                        onClick={handleDeleteThumbnailMedia}
                        sx={{ padding: "3%" }}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    )}
                  </FlexBetween>
                )}
              </Dropzone>
            </Box>
            {thumbnailPreview && (
              <Box
                mt="1rem"
                display={"flex"}
                width={"100%"}
                justifyContent={"center"}
                pb="1rem"
              >
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
            {thumbnailUnsupportedFormat && (
              <Typography color="error" mt="0.5rem">
                Unsupported file format. Only image files are allowed for
                Thumbnail.
              </Typography>
            )}
            <ReactQuill
              value={blogContent}
              onChange={handleBlogEditorChange}
              style={{
                borderRadius: "0.75rem",
                maxWidth: "100%",
                height: "33vh",
                marginBottom: "3rem",
              }}
            />
            <Box display="flex" flexDirection="row-reverse" width="100%">
              <Button
                disabled={blogContent === ""}
                onClick={handlePost}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                  marginTop: "1rem",
                }}
              >
                POST
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
