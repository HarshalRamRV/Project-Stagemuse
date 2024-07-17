// CustomFacebookLoginButton.js
import React from 'react';
import FacebookLogin from 'react-facebook-login';

const CustomFacebookLoginButton = ({ onFacebookLogin }) => {
  const responseFacebook = (response) => {
    onFacebookLogin(response);
  };

  return (
    <FacebookLogin
      appId="your-app-id"
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      icon="fa-facebook"
      textButton="Login with Facebook"
    />
  );
};

export default CustomFacebookLoginButton;
