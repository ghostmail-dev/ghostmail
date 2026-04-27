import { invitesCollection } from "../collections/invites"
import {
  AbstractInvitesLoader,
  AbstractInvitesMutator,
  UnknownDatabaseError,
} from "../definitions"
import { spawnInvite, toInviteDTO } from "../models/invites"
import { tryCatch } from "../result"

export class InvitesLoader extends AbstractInvitesLoader {
  async getInvitesByUsername(username: string) {
    return await tryCatch(async () => {
      const inviteDocs = await invitesCollection
        .find({ invitedBy: username })
        .toArray()
      return inviteDocs.map(toInviteDTO)
    }, UnknownDatabaseError)
  }

  async validateInvite(code: string) {
    return await tryCatch(async () => {
      const inviteDoc = await invitesCollection.findOne({ code })
      if (
        inviteDoc &&
        (inviteDoc.expiresAt < new Date() || inviteDoc.status === "used")
      ) {
        // Invite has expired, delete it from the database
        await invitesCollection.deleteOne({ code })
        return false
      }
      return !!inviteDoc
    }, UnknownDatabaseError)
  }
}

export class InvitesMutator extends AbstractInvitesMutator {
  async createInvite(invitedBy: string, persistentTokens: number) {
    const inviteDoc = spawnInvite({ invitedBy, persistentTokens })
    return await tryCatch(async () => {
      await invitesCollection.insertOne(inviteDoc)
      return toInviteDTO(inviteDoc)
    }, UnknownDatabaseError)
  }

  async deleteInvite(code: string) {
    return await tryCatch(async () => {
      await invitesCollection.deleteOne({ code })
    }, UnknownDatabaseError)
  }
}
