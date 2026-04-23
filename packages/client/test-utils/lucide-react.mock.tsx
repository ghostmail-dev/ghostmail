import type { SVGProps } from "react"

function Icon(props: SVGProps<SVGSVGElement>, name: string) {
  return <svg aria-hidden="true" data-testid={name} {...props} />
}

export const Archive = (props: SVGProps<SVGSVGElement>) =>
  Icon(props, "archive")
export const Clock = (props: SVGProps<SVGSVGElement>) => Icon(props, "clock")
export const Info = (props: SVGProps<SVGSVGElement>) => Icon(props, "info")
export const Moon = (props: SVGProps<SVGSVGElement>) => Icon(props, "moon")
export const Plus = (props: SVGProps<SVGSVGElement>) => Icon(props, "plus")
export const Sun = (props: SVGProps<SVGSVGElement>) => Icon(props, "sun")
export const Trash2 = (props: SVGProps<SVGSVGElement>) => Icon(props, "trash2")
export const Inbox = (props: SVGProps<SVGSVGElement>) => Icon(props, "inbox")
export const Mail = (props: SVGProps<SVGSVGElement>) => Icon(props, "mail")
export const MailOpen = (props: SVGProps<SVGSVGElement>) =>
  Icon(props, "mail-open")
export const ArrowBigLeft = (props: SVGProps<SVGSVGElement>) =>
  Icon(props, "arrow-big-left")
