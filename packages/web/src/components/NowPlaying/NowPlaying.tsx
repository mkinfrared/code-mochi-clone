import React from "react";
import Link from "next/link";

import movieApi from "../../utils/movieApi";

import { NowPlayingState } from "./NowPlaying.type";

class NowPlaying extends React.Component<{}, NowPlayingState> {
  state: NowPlayingState = {
    movies: []
  };

  componentDidMount() {
    this.fetchNowPlaying();
  }

  fetchNowPlaying = async () => {
    const response = await movieApi.get(
      `/movie/now_playing?api_key=${process.env.TMDB_MOVIE_KEY}&language=en-US&page=1`
    );

    const movies = response.data.results;

    this.setState({ movies });
  };

  render() {
    const movieList = this.state.movies.map(movie => (
      <li key={movie.id}>
        <Link href={`/movie/${movie.id}`}>
          <a>{movie.title}</a>
        </Link>
      </li>
    ));

    return (
      <div>
        <ul>{movieList}</ul>
      </div>
    );
  }
}

export default NowPlaying;
