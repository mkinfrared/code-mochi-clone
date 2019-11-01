import React from "react";
import { NextPage } from "next";

import Navigation from "src/components/Navigation";
import Ticker from "src/components/Ticker";

const Swapi: NextPage = () => {
  return (
    <>
      <div>
        <Navigation />
        <h1>SWAPI</h1>
        <Ticker />
      </div>
    </>
  );
};

export default Swapi;
