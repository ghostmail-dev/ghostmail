import { invitesCollection } from "../collections/invites"
import { AbstractInvitesLoader, AbstractInvitesMutator } from "../definitions"
import {
  SerializableInviteDocument,
  spawnInvite,
  toInviteDTO,
} from "../models/invites"

export class InvitesLoader extends AbstractInvitesLoader {
  async getInvitesByUsername(
    username: string,
  ): Promise<SerializableInviteDocument[]> {
    const inviteDocs = await invitesCollection
      .find({ invitedBy: username })
      .toArray()
    return inviteDocs.map(toInviteDTO)
  }
  async validateInvite(code: string): Promise<boolean> {
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
  }
}

export class InvitesMutator extends AbstractInvitesMutator {
  async createInvite(
    invitedBy: string,
    persistentTokens: number,
  ): Promise<SerializableInviteDocument> {
    const inviteDoc = spawnInvite({ invitedBy, persistentTokens })
    await invitesCollection.insertOne(inviteDoc)
    return toInviteDTO(inviteDoc)
  }

  async deleteInvite(code: string): Promise<void> {
    await invitesCollection.deleteOne({ code })
  }
}
