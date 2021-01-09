const { forwardTo } = require("prisma-binding");
const {
  checkIfUserLoggedIn,
  hasPermission,
  getCurrentUser,
} = require("../utils");

const Query = {
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();

  //   return items;
  // }
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  async me(parent, args, ctx, info) {
    const userId = ctx.request.userId;
    if (!userId) {
      return null;
    }

    return await ctx.db.query.user(
      {
        where: { id: userId },
      },
      info,
    );
  },

  async users(parent, args, ctx, info) {
    // check if user is logged in
    checkIfUserLoggedIn(ctx);

    // check if user have enough permission
    const currentUser = await getCurrentUser(ctx);
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);

    const allUsers = await ctx.db.query.users({}, info);
    return allUsers;
  },
};

module.exports = Query;
