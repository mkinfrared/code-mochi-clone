import axios from "axios";

const fetchCurrentUser = () => {
  return axios.get("http://localhost:4747/me", { withCredentials: true });
};

export default fetchCurrentUser;
