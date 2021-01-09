const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeEmail } = require("../mail");
const {
  checkIfUserLoggedIn,
  setTokenToCookie,
  hasPermission,
  getCurrentUser,
} = require("../utils");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    checkIfUserLoggedIn(ctx);

    const currentUser = await getCurrentUser(ctx);
    const item = await ctx.db.mutation.createItem(
      {
        // create relationship between items & user
        user: {
          connect: {
            id: ctx.request.userId,
          },
        },
        data: { ...args, user: currentUser },
      },
      info,
    );

    return item;
  },

  updateItem(parent, args, ctx, info) {
    const { id, ...updates } = args;

    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id,
        },
      },
      info,
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`);

    // check user permission
    const currentUser = await getCurrentUser(ctx);
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissionToDeleteItem = currentUser.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission),
    );
    if (!ownsItem && !hasPermissionToDeleteItem) {
      throw new Error("You don't have permission to do that");
    }

    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // lowercase all email
    const email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create user
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          email,
          password,
          permissions: { set: ["USER"] },
        },
      },
      info,
    );
    // create the JWT token
    setTokenToCookie(user.id, ctx);

    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // check the user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // check the password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password!");
    }

    // create the JWT token
    setTokenToCookie(user.id, ctx);

    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },

  async requestReset(parent, { email }, ctx, info) {
    // 1. check if user exist
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // 2. set a reset token & expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = (Date.now() + 72 * 3600 * 1000).toString();
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // email user
    const resetTokenLink = `${
      process.env.FRONTEND_URL
    }/reset?resetToken=${resetToken}`;
    const mailRes = await transport.sendMail({
      from: "info@thundermiracle.com",
      to: user.email,
      subject: "Your password reset link",
      html: makeEmail(`<a href="${resetTokenLink}">${resetTokenLink}</a>`),
    });

    // return message
    return { message: "Success!" };
  },

  async resetPassword(
    parent,
    { password, confirmPassword, resetToken },
    ctx,
    info,
  ) {
    // check if password is match
    if (password !== confirmPassword) {
      throw new Error("Yo passwords don't match");
    }

    // check valid resetToken
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now().toString(),
      },
    });
    if (!user) {
      throw new Error("This token is either invalid or expired!");
    }

    // check the token expiry
    const passwordDb = await bcrypt.hash(password, 10);

    // hash their new password
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: passwordDb,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // replace to new password
    setTokenToCookie(updatedUser.id, ctx);

    // Generate JWT
    // set JWT to cookie
    // return a new user
    return updatedUser;
  },

  async updatePermissions(parent, { permissions, userId }, ctx, info) {
    // check if logged in
    checkIfUserLoggedIn(ctx);

    // query current user
    const currentUser = await getCurrentUser(ctx);

    // check the permission to do this
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);

    // update target user's permissions
    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: permissions,
        },
      },
      where: {
        id: userId,
      },
    });
  },
};

module.exports = Mutations;
