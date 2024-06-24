import type { EmailResolvers } from "../../types.generated";
export const Email: EmailResolvers = {
  /* Implement Email resolver logic here */
  _id: ({ _id }, _arg, _ctx) => {
    /* Email._id resolver is required because Email._id and EmailMapper._id are not compatible */
    return _id.toHexString();
  },
  date: ({ date }, _arg, _ctx) => {
    /* Email.date resolver is required because Email.date and EmailMapper.date are not compatible */
    return date;
  },
  fromText: async ({ from }, _arg, _ctx) => {
    /* Email.fromText resolver is required because Email.fromText exists but EmailMapper.fromText does not */
    return from ? from.text : null;
  },
  html: ({ html }, _arg, _ctx) => {
    /* Email.html resolver is required because Email.html and EmailMapper.html are not compatible */
    return html ? html : null;
  },
  toText: async ({ to }, _arg, _ctx) => {
    /* Email.toText resolver is required because Email.toText exists but EmailMapper.toText does not */
    if (!to) return null;
    return Array.isArray(to) ? to.flatMap((t) => t.text).join(", ") : to.text;
  },
};
