import type { SVGProps } from "react"

function Icon(props: SVGProps<SVGSVGElement>, name: string) {
  return <svg aria-hidden="true" data-testid={name} {...props} />
}

export const Archive = (props: SVGProps<SVGSVGElement>) =>
  Icon(props, "archive")
export const Clock = (props: SVGProps<SVGSVGElement>) => Icon(props, "clock")
export const Code = (props: SVGProps<SVGSVGElement>) => Icon(props, "code")
export const Eye = (props: SVGProps<SVGSVGElement>) => Icon(props, "eye")
export const Info = (props: SVGProps<SVGSVGElement>) => Icon(props, "info")
export const Key = (props: SVGProps<SVGSVGElement>) => Icon(props, "key")
export const LogOut = (props: SVGProps<SVGSVGElement>) => Icon(props, "log-out")
export const Moon = (props: SVGProps<SVGSVGElement>) => Icon(props, "moon")
export const Plus = (props: SVGProps<SVGSVGElement>) => Icon(props, "plus")
export const Settings = (props: SVGProps<SVGSVGElement>) =>
  Icon(props, "settings")
export const Sun = (props: SVGProps<SVGSVGElement>) => Icon(props, "sun")
export const Trash2 = (props: SVGProps<SVGSVGElement>) => Icon(props, "trash2")
export const Inbox = (props: SVGProps<SVGSVGElement>) => Icon(props, "inbox")
export const Mail = (props: SVGProps<SVGSVGElement>) => Icon(props, "mail")
export const MailOpen = (props: SVGProps<SVGSVGElement>) =>
  Icon(props, "mail-open")
export const User = (props: SVGProps<SVGSVGElement>) => Icon(props, "user")
export const ArrowBigLeft = (props: SVGProps<SVGSVGElement>) =>
  Icon(props, "arrow-big-left")
export const Check = (props: SVGProps<SVGSVGElement>) => Icon(props, "check")
export const Copy = (props: SVGProps<SVGSVGElement>) => Icon(props, "copy")
export const ArrowLeft = (props: SVGProps<SVGSVGElement>) =>
  Icon(props, "arrow-left")
