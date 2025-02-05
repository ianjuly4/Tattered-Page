import React from "react";

function Navbar() {
  return (
    <div className="navbar bg-base-100 border-t-2 border-b-2 border-gray-300">
      {/* Left section: The Tattered Page logo */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">The Tattered Page</a>
      </div>

      {/* Right section: Icons and links */}
      <div className="flex-none gap-4">
        {/* Search with Dropdown */}
        <div className="dropdown dropdown-end">
          <div className="form-control">
            <div className="relative">
              {/* Search input styled like Bookshelves */}
              <input
                type="text"
                placeholder="Search Book"
                className="input input-bordered w-24 md:w-auto btn-ghost"
              />
              {/* Dropdown for search filters */}
              <ul
                tabIndex={0}
                className="dropdown-content menu menu-compact bg-base-100 rounded-box w-52 mt-2 p-2 shadow-lg"
              >
                <li>
                  <a>By Author</a>
                </li>
                <li>
                  <a>By Genre</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Account Icon with dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Profile Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>

        {/* Links to Bookshelves and Bookclub */}
        <div className="flex gap-4">
          <a className="btn btn-ghost">Bookshelves</a>
          <a className="btn btn-ghost">Bookclub</a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
