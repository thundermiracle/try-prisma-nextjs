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

  async order(parent, { id }, ctx, info) {
    // check if user is logged in
    checkIfUserLoggedIn(ctx);
    const currentUser = await getCurrentUser(ctx);

    // query order
    const order = await ctx.db.query.order(
      {
        where: { id },
      },
      info,
    );
    if (!order) {
      throw new Error("Order not exist.");
    }

    // check permission
    const ownOrder = order.user.id === currentUser.id;
    const hasPermissionToSeeOrder = currentUser.permissions.includes("ADMIN");
    if (!ownOrder && !hasPermissionToSeeOrder) {
      throw new Error("You're not permitted to see this.");
    }

    return order;
  },
};

module.exports = Query;
