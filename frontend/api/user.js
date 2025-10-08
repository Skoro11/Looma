import axios from "axios";

import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;
export async function LoginUser(email, password) {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    );

    if (response.data.code === "LOGIN_SUCCESS") {
      toast.success(response.data.message);
    }

    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data;

      switch (code) {
        case "USER_NOT_FOUND":
          toast.error("No account with that email.");
          break;
        case "INVALID_CREDENTIALS":
          toast.error("Email or password is wrong.");
          break;
        default:
          toast.error(message || "Something went wrong. Try again.");
      }
    } else if (error.request) {
      toast.error("Server not reachable. Check your connection.");
    } else {
      toast.error("Unexpected error occurred.");
    }
  }
}

export async function RegisterUser(username, email, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      username: username,
      email: email,
      password: password,
    });

    if (response.data.code === "USER_REGISTERED") {
      toast.success(response.data.message);
    }

    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data;

      switch (code) {
        case "EMAIL_IN_USE":
          toast.error("Email is already in use");
          break;
        case "SERVER_ERROR":
          toast.error("Something went wrong by registering");
          break;
        default:
          toast.error(message || "Something went wrong. Try again.");
      }
    } else if (error.request) {
      toast.error("Server not reachable. Check your connection.");
    } else {
      toast.error("Unexpected error occurred.");
    }
  }
}
