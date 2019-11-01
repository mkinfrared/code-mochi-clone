import axios from "axios";
import { NextPageContext } from "next";
import Router from "next/router";
import React from "react";

import { setCurrentUser } from "src/store/reducers/user/actions";
import isServer from "src/utils/isServer";
import { MyAppProps } from "pages/_app";

const redirect = (context: NextPageContext, target: string) => {
  if (context.res) {
    context.res.writeHead(302, { Location: target });
    context.res.end();
  } else {
    Router.push(target);
  }
};

const checkUser = async (context: NextPageContext & MyAppProps) => {
  const { store } = context;
  const { id } = store.getState().user;

  if (id) return;

  if (isServer(context)) {
    try {
      const response = await axios.get("http://localhost:4747/me", {
        withCredentials: true,
        headers: { Cookie: context.req!.headers.cookie }
      });
      const user = response.data;

      if (!user || !user.id) {
        throw new Error("not authorized");
      }

      store.dispatch(setCurrentUser(user));
    } catch {
      redirect(context, "/signin");
    }
  }
};

const withAuth = (C: React.ComponentType) => {
  return class extends React.Component<any> {
    static async getInitialProps(ctx: NextPageContext) {
      await checkUser(ctx as any);

      return {};
    }

    render() {
      return <C {...this.props} />;
    }
  };
};

export default withAuth;
