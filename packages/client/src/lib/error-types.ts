import { isRouteErrorResponse } from "react-router-dom"

export enum ErrorTypes {
  UNAUTHORIZED = "UNAUTHORIZED",
}

export class ErrorResponse extends Response {
  constructor(
    data: {
      message: string
      errorType: ErrorTypes
    },
    { status }: { status: number }
  ) {
    super(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export const isErrorResponseType = (
  err: unknown
): err is ErrorResponse & {
  data: {
    message: string
    errorType: ErrorTypes
  }
} => {
  if (isRouteErrorResponse(err)) {
    return (
      typeof err.data.message === "string" &&
      typeof err.data.errorType === "string"
    )
  }
  return false
}
