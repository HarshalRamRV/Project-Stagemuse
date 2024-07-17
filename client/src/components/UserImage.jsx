import { Box } from "@mui/material";

const UserImage = ({ image, size = "50px" }) => {
  let imageUrl = image;
  imageUrl = `http://localhost:3001/assets/${image}`;
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={imageUrl}
      />
    </Box>
  );
};

export default UserImage;
