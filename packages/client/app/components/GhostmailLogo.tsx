export const GhostMailLogo = ({ className }: { className?: string }) => {
  return (
    <>
      <img
        src="/ghostmail-dark.png"
        alt="GhostMail"
        className={
          className ? className + " block dark:hidden" : "block dark:hidden"
        }
      />
      <img
        src="/ghostmail-light.png"
        alt="GhostMail"
        className={
          className ? className + " hidden dark:block" : "hidden dark:block"
        }
      />
    </>
  )
}
