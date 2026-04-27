import { invitesCollection } from "../collections/invites"
import { type InviteDocument, spawnInvite } from "../models/invites"

export const seedInvite = async (overrides?: Partial<InviteDocument>) => {
  const invite = spawnInvite(overrides)
  await invitesCollection.insertOne(invite)
  return invite
}
