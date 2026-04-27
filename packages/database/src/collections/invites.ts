import { mongoDB } from "../connection"
import type { InviteDocument } from "../models/invites"

export const invitesCollection = mongoDB.collection<InviteDocument>("invites")
