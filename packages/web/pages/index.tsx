import React from "react";
import { NextPage } from "next";

import Navigation from "src/components/Navigation";
import Ticker from "src/components/Ticker";
import withAuth from "src/hoc/withAuth";

const Index: NextPage = () => {
  return (
    <div>
      <Navigation />
      <h1>HOME</h1>
      <Ticker />
    </div>
  );
};

export default withAuth(Index);
