import axios from "axios";

const movieApi = axios.create({
  baseURL: "https://api.themoviedb.org/3"
});

export default movieApi;
