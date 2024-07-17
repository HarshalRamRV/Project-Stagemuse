import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import GoogleLogo from "../../asset/GoogleLogo.png";
import { gapi } from "gapi-script";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login';

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const loggedIn = await savedUserResponse.json();
    onSubmitProps.resetForm();
    console.log(loggedIn);
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const googleLogin = async (tokenResponse) => {
    try {
      console.log(tokenResponse.tokenId);
      const loggedInResponse = await fetch(
        `http://localhost:3001/auth/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: tokenResponse.tokenId,
          }),
        }
      );

      if (loggedInResponse.ok) {
        const loggedIn = await loggedInResponse.json();
        console.log(loggedIn);
        if (loggedIn) {
          dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.resToken,
            })
          );
          navigate("/home");
        }
      } else {
        // Handle non-successful response, e.g., network errors or invalid token
        console.error("Login request failed.");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  const googleSignup = async (tokenResponse) => {
    console.log(tokenResponse.tokenId);
    const loggedInResponse = await fetch(
      `http://localhost:3001/auth/google-signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenResponse.tokenId,
        }),
      }
    );
    const loggedIn = await loggedInResponse.json();
    console.log(loggedIn);
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.resToken,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const responseGoogle = async (response) => {
    if (isLogin) await googleLogin(response);
    if (isRegister) await googleSignup(response);
  };

  const responseFacebook = (response) => {
    console.log(response);
  }
   

  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId:
        "763321289202-36gs0uqe1cg3sce7gtg73i6toaun6uuk.apps.googleusercontent.com",
    });
  });

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "1rem 0",
                p: "1rem",
                textTransform: "capitalize",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "Login" : "Register"}
            </Button>
            <GoogleLogin
              clientId="763321289202-36gs0uqe1cg3sce7gtg73i6toaun6uuk.apps.googleusercontent.com"
              buttonText="Google login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
              fullWidth
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  fullWidth
                  sx={{
                    marginBottom: "1rem",
                    textTransform: "capitalize",
                    p: "1rem",
                    backgroundColor: "#fff",
                    color: palette.background.alt,
                    "&:hover": { color: palette.neutral.main },
                  }}
                >
                  <img
                    src={GoogleLogo}
                    alt="Google Logo"
                    style={{
                      width: "2.5rem",
                      height: "1.5rem",
                      padding: "0 .5rem ",
                    }}
                  />
                  {isLogin ? "Google login" : "Google Register"}
                </Button>
              )}
            ></GoogleLogin>


            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;

// <FacebookLogin
// appId="325661616713164"
// autoLoad={true}
// fields="name,email,picture"
// callback={responseFacebook} 
// render={(renderProps) => (
//   <Button
//     onClick={renderProps.onClick}
//     fullWidth
//     sx={{
//       marginBottom: "1rem",
//       textTransform: "capitalize",
//       p: "1rem",
//       backgroundColor: "#fff",
//       color: palette.background.alt,
//       "&:hover": { color: palette.neutral.main },
//     }}
//   >
//     <img
//       src="https://freepngimg.com/thumb/facebook/141229-logo-circle-pic-facebook-free-hd-image.png" // Replace with the actual path to your Google logo image
//       alt="Facebook Logo"
//       style={{
//         width: "2.5rem", // Adjust the width and height as needed
//         height: "1.5rem",
//         padding: "0 .5rem ",
//       }}
//     />
//     {isLogin ? "Facebook login" : "Facebook Register"}
//   </Button>)}
//   ></FacebookLogin>
//   <Button
//   fullWidth
//   type="submit"
//   sx={{
//     marginBottom: "1rem",
//     textTransform: "capitalize",
//     p: "1rem",
//     backgroundColor: "#fff",
//     color: palette.background.alt,
//     "&:hover": { color: palette.neutral.main },
//   }}
// >
//   <img
//     src="https://store-images.s-microsoft.com/image/apps.21465.9007199266245564.5c86c318-51bf-425a-9b3d-75e1fd3198b1.cad44b54-5070-478b-a977-c5d442325b8a" // Replace with the actual path to your Google logo image
//     alt="Linkedin Logo"
//     style={{
//       width: "2.5rem", // Adjust the width and height as needed
//       height: "1.5rem",
//       padding: "0 .5rem ",
//     }}
//   />
//   {isLogin ? "Linkedin login" : "Linkedin Register"}
// </Button>