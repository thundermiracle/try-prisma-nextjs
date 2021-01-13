const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeEmail } = require("../mail");
const stripe = require("../stripe");
const {
  checkIfUserLoggedIn,
  setTokenToCookie,
  hasPermission,
  getCurrentUser,
} = require("../utils");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    checkIfUserLoggedIn(ctx);

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          // create relationship between items & user
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
        },
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

  async addToCart(parent, args, ctx, info) {
    // check if logged in
    checkIfUserLoggedIn(ctx);

    // Query the users current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: ctx.request.userId },
        item: { id: args.id },
      },
    });

    // Check if that item if already in their cart (increment by 1)
    if (existingCartItem) {
      console.log("This item is already in their cart");
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        },
        info,
      );
    }

    // Add CartItem if not exist
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: ctx.request.userId },
          },
          item: {
            connect: { id: args.id },
          },
        },
      },
      info,
    );
  },

  async removeFromCart(parent, { id }, ctx, info) {
    checkIfUserLoggedIn(ctx);

    // Find cart item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: {
          id,
        },
      },
      "{ id, user { id } }",
    );
    if (!cartItem) {
      throw new Error("No CartItem found");
    }

    // Make sure they own it
    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error("No way...");
    }

    // Delete cart item
    return ctx.db.mutation.deleteCartItem(
      {
        where: {
          id,
        },
      },
      info,
    );
  },

  async createOrder(parent, { token }, ctx, info) {
    // Check if logged in
    checkIfUserLoggedIn(ctx);
    const currentUser = await getCurrentUser(
      ctx,
      `{
          id
          name
          email
          cart {
            id
            quantity
            item {
              id
              title
              price
              description
              image
              largeImage
            }
          }
        }`,
    );

    // Recalculate the price again on server side
    const amount = currentUser.cart.reduce(
      (prevAmount, cartItem) =>
        prevAmount + cartItem.item.price * cartItem.quantity,
      0,
    );

    // Create the stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: "JPY",
      source: token,
    });

    // Convert CartItems to OrderItems
    const orderItems = currentUser.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      };

      delete orderItem.id;
      return orderItem;
    });

    // Create Order
    const order = await ctx.db.mutation.createOrder({
      data: {
        items: { create: orderItems },
        total: charge.amount,
        charge: charge.id,
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    // Clean up -- delete cart, delete cartitems
    const cartItemIds = currentUser.cart.map(({ id }) => id);
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds,
      },
    });

    // return Order
    return order;
  },
};

module.exports = Mutations;
