export const Navbar = () => {
  return (
    <nav className="bg-gray-700">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white p-4">
            <h1 className="text-2xl">Ghostmail</h1>
          </div>
          <div className="p-4">
            <a href="/login" className="text-white">
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
