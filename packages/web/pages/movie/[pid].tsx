import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

import Movie from "src/components/Movie";
import withAuth from "src/hoc/withAuth";

const MoviePage: NextPage = () => {
  const router = useRouter();
  const { pid } = router.query;

  return (
    <div>
      <Movie id={+pid} />
      <Link href="/now-playing">
        <a>Go back to now playing</a>
      </Link>
    </div>
  );
};

export default withAuth(MoviePage);
