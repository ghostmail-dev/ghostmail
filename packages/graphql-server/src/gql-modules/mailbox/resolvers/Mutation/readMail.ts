import { ObjectId } from "mongodb"
import type { MutationResolvers } from "../../../types.generated"
import { Mailboxes } from "@ghostmail-packages/database"

export const readMail: NonNullable<MutationResolvers["readMail"]> = async (
  _parent,
  { mailId },
  { username, dataSources }
) => {
  if (!username) {
    throw new Error("Unauthorized")
  }
  await Mailboxes.updateOne(
    {
      username,
    },
    [
      {
        $set: {
          emails: {
            $map: {
              input: "$emails",
              as: "email",
              in: {
                $cond: [
                  {
                    $eq: ["$$email.emailId", new ObjectId(mailId)],
                  },
                  {
                    $mergeObjects: [
                      "$$email",
                      {
                        isRead: true,
                      },
                    ],
                  },
                  "$$email",
                ],
              },
            },
          },
        },
      },
    ]
  )

  const mailbox = await dataSources.MailboxLoader.getMailboxByName(username)
  const newValue = !!mailbox?.emails.find(
    (email) => email.emailId.toHexString() === mailId
  )
  return newValue
}
