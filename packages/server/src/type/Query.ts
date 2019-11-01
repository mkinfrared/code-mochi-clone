import { idArg, queryType, stringArg } from "nexus";

import { getUserId } from "../utils";

export const Query = queryType({
  definition(t) {
    t.field("me", {
      type: "User",
      nullable: true,
      resolve: async (parent, args, ctx) => {
        const id = getUserId(ctx);
        const user = await ctx.photon.users.findOne({ where: { id } });

        return user;
      }
    });

    t.list.field("heroes", {
      type: "Hero",
      resolve: (root, args, context) => context.photon.heroes.findMany()
    });

    t.list.field("feed", {
      type: "Post",
      resolve: (parent, args, ctx) => {
        return ctx.photon.posts.findMany({
          where: { published: true }
        });
      }
    });

    t.list.field("filterPosts", {
      type: "Post",
      args: {
        searchString: stringArg({ nullable: true })
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.photon.posts.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: searchString
                }
              },
              {
                content: {
                  contains: searchString
                }
              }
            ]
          }
        });
      }
    });

    t.field("post", {
      type: "Post",
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.photon.posts.findOne({
          where: { id }
        });
      }
    });
  }
});
