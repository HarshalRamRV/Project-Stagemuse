import { OAuth2Client } from 'google-auth-library';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    console.log(token);
    
    // Verify the Google token
    const ticket = await verifygoogleToken(token);
    const payload = ticket.getPayload();
    const email = payload.email;

    // Check if the user exists in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist." });
    }

    // If the user exists, you can generate a JWT token and return it with the user data
    const resToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; // Remove sensitive data before sending the response

    res.status(200).json({ resToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const googleSignup = async (req, res) => {
  try {
    const { token } = req.body;

    const googleUser = await verifygoogleToken(token);

    const { given_name, family_name, email, picture } = googleUser.getPayload();;
    console.log(googleUser);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newUser = await User.create({
      firstName: given_name,
      lastName: family_name,
      email: email,
      picturePath: picture,
      verified: true, 
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error in signupController:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};




// Function to verify Google access token using the 'google-auth-library'
async function verifygoogleToken(token) {
  const client = new OAuth2Client("763321289202-36gs0uqe1cg3sce7gtg73i6toaun6uuk.apps.googleusercontent.com");
  // Verify the Google access token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: "763321289202-36gs0uqe1cg3sce7gtg73i6toaun6uuk.apps.googleusercontent.com", // Replace with your Google OAuth client ID
  });

  return ticket;
}
