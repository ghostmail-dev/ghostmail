import type { EmailResolvers } from "./../../types.generated";
export const Email: EmailResolvers = {
  /* Implement Email resolver logic here */
  _id: ({ _id }, _arg, _ctx) => {
    /* Email._id resolver is required because Email._id and EmailMapper._id are not compatible */
    return _id;
  },
  date: ({ date }, _arg, _ctx) => {
    /* Email.date resolver is required because Email.date and EmailMapper.date are not compatible */
    return date;
  },
  html: ({ html }, _arg, _ctx) => {
    /* Email.html resolver is required because Email.html and EmailMapper.html are not compatible */
    return html;
  },
};
