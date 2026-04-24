import { mongoDB } from "../connection"
import { InviteDocument } from "../models/invites"

export const invitesCollection = mongoDB.collection<InviteDocument>("invites")
