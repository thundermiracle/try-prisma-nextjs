const Mutations = {
  // TODO: check if user is logged in

  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem({
      data: { ...args },
    }, info);

    return item;
  },

  updateItem(parent, args, ctx, info) {
    const {id , ...updates} = args;

    return ctx.db.mutation.updateItem({
      data: updates,
      where : {
        id,
      },
    }, info);
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title }`);

    // check user permission


    return ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = Mutations;
