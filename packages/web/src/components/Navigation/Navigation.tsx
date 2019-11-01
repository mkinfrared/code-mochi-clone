import * as React from "react";
import Link from "next/link";

const Navigation = () => {
  return (
    <div className="navigation">
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/now-playing">
        <a>Now Playing</a>
      </Link>
    </div>
  );
};

export default Navigation;
