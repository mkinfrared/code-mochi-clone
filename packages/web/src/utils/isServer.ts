import { NextPageContext } from "next";

const isServer = ({ req, res }: NextPageContext) => !!req && !!res;

export default isServer;
