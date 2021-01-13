const jwt = require("jsonwebtoken");

function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave),
  );
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions

      : ${permissionsNeeded}

      You Have:

      ${user.permissions}
      `);
  }
}

const checkIfUserLoggedIn = ctx => {
  if (!ctx.request.userId) {
    throw new Error("You must be logged in to do that!");
  }
};

const setTokenToCookie = (userId, ctx) => {
  const token = jwt.sign({ userId }, process.env.APP_SECRET);
  // set jwt to cookie
  ctx.response.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day cookie
  });
};

const getCurrentUser = async (ctx, queryString = "{ id, permissions }") => {
  const currentUser = await ctx.db.query.user(
    {
      where: {
        id: ctx.request.userId,
      },
    },
    queryString,
  );

  return currentUser;
};

exports.hasPermission = hasPermission;
exports.checkIfUserLoggedIn = checkIfUserLoggedIn;
exports.setTokenToCookie = setTokenToCookie;
exports.getCurrentUser = getCurrentUser;
