import { idArg, mutationType, stringArg } from "nexus";
import { compare, hash } from "bcryptjs";

import generateTokens from "@util/generateTokens";
import { Context } from "@util/context";

import { getUserId } from "../utils";

export const Mutation = mutationType({
  definition(t) {
    t.field("signup", {
      type: "Boolean",
      args: {
        name: stringArg({ nullable: false }),
        password: stringArg({ nullable: false })
      },
      resolve: async (root, { name, password }, context: Context) => {
        try {
          const hashPassword = await hash(password, 12);
          const user = { name, password: hashPassword };

          await context.photon.users.create({ data: user });

          return true;
        } catch (e) {
          return false;
        }
      }
    });

    t.field("login", {
      type: "Boolean",
      args: {
        name: stringArg({ nullable: false }),
        password: stringArg({ nullable: false })
      },
      resolve: async (root, { name, password }, context: Context) => {
        try {
          const user = await context.photon.users.findOne({
            where: {
              name
            }
          });
          if (!user) {
            throw new Error(`No user found for name: ${name}`);
          }
          const passwordValid = await compare(password, user.password);
          if (!passwordValid) {
            throw new Error("Invalid password");
          }
          const [accessToken, refreshToken] = await generateTokens({
            userID: user.id
          });

          context.response.cookie("accessToken", accessToken, {
            httpOnly: true
          });
          context.response.cookie("refreshToken", refreshToken, {
            httpOnly: true
          });

          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      }
    });

    t.field("createDraft", {
      type: "Post",
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg()
      },
      resolve: (parent, { title, content }, ctx) => {
        const userId = getUserId(ctx);
        return ctx.photon.posts.create({
          data: {
            title,
            content,
            published: false,
            author: { connect: { id: userId } }
          }
        });
      }
    });

    t.field("deletePost", {
      type: "Post",
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.photon.posts.delete({
          where: {
            id
          }
        });
      }
    });

    t.field("publish", {
      type: "Post",
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.photon.posts.update({
          where: { id },
          data: { published: true }
        });
      }
    });
  }
});
