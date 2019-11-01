import React from "react";
import { NextPage } from "next";

import Navigation from "src/components/Navigation";
import NowPlaying from "src/components/NowPlaying";
import Ticker from "src/components/Ticker";
import withAuth from "src/hoc/withAuth";

const NowPlayingPage: NextPage = () => {
  return (
    <div>
      <Navigation />
      <Ticker />
      <NowPlaying />
    </div>
  );
};

export default withAuth(NowPlayingPage);
