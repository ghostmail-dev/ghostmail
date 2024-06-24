import type { EmailAttachmentResolvers } from "./../../types.generated";
export const EmailAttachment: EmailAttachmentResolvers = {
  /* Implement EmailAttachment resolver logic here */

  generatedFileName: async ({ filename }) => {
    /* EmailAttachment.generatedFileName resolver is required because EmailAttachment.generatedFileName exists but EmailAttachmentMapper.generatedFileName does not */
    return filename;
  },

  transferEncoding: async ({ headers }, _arg, _ctx) => {
    /* EmailAttachment.transferEncoding resolver is required because EmailAttachment.transferEncoding exists but EmailAttachmentMapper.transferEncoding does not */
    return headers["content-transfer-encoding"] ?? "";
  },
};
