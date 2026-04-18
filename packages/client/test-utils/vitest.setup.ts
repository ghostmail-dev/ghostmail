import "@testing-library/jest-dom"
import { vi, afterEach } from "vitest"
import {
  MockMailboxesLoader,
  MockMailboxesMutator,
  MockEmailsLoader,
  MockEmailsMutator,
  MockUsersLoader,
  MockUsersMutator,
  resetMockDatabase,
} from "./mock-dal"

vi.mock("@ghostmail/database", () => ({
  MailboxesLoader: MockMailboxesLoader,
  MailboxesMutator: MockMailboxesMutator,
  EmailsLoader: MockEmailsLoader,
  EmailsMutator: MockEmailsMutator,
  UsersLoader: MockUsersLoader,
  UsersMutator: MockUsersMutator,
}))

afterEach(() => {
  resetMockDatabase()
})
