import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export async function CheckToken() {
  try {
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      withCredentials: true,
    });

    return response;
  } catch (error) {
    return error.message;
  }
}
