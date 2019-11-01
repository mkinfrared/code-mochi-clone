/* eslint-disable camelcase */
import React from "react";

import movieApi from "src/utils/movieApi";

import { MovieProps, MovieState } from "./Movie.type";
import css from "./Movie.scss";

class Movie extends React.Component<MovieProps, MovieState> {
  state: MovieState = {};

  componentDidMount() {
    this.fetchMovie();
  }

  fetchMovie = async () => {
    const { id } = this.props;
    const response = await movieApi.get(
      `/movie/${id}?api_key=${process.env.TMDB_MOVIE_KEY}&language=en-US`
    );
    const movie = response.data;

    this.setState({ ...movie });
  };

  render() {
    const {
      poster_path,
      title,
      vote_average,
      budget,
      runtime,
      overview
    } = this.state;

    if (title) {
      return (
        <div className={css.movie}>
          <img
            src={poster_path && process.env.TMDB_IMAGE_URL + poster_path}
            alt="poster"
          />
          <h3>{title}</h3>
          <p>
            Rating:
            {vote_average}
          </p>
          <p>
            Budget:
            {budget}
          </p>
          <p>
            Runtime:
            {runtime}
          </p>
          <p>
            Overview:
            {overview}
          </p>
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

export default Movie;
