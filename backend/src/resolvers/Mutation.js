const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Mutations = {
  // TODO: check if user is logged in

  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem({
      data: { ...args },
    }, info);

    return item;
  },

  updateItem(parent, args, ctx, info) {
    const { id, ...updates } = args;

    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id,
      },
    }, info);
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title }`);

    // check user permission


    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // lowercase all email
    const email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create user
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        email,
        password,
        permissions: { set: ['USER'] },
      }
    }, info);
    // create the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set jwt to cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day cookie
    });

    return user;
  },
};

module.exports = Mutations;
