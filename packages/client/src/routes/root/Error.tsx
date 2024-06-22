import { ErrorResponse, ErrorTypes } from "~/lib/error-types"

export class UserNotFoundError extends ErrorResponse {
  constructor(email: string) {
    super(
      {
        message: `No account found for ${email}`,
        errorType: ErrorTypes.UNAUTHORIZED,
      },
      {
        status: 404,
      }
    )
  }
}
