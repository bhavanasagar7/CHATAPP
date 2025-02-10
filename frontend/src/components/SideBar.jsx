import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { CiLogout, CiHome } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Baseurl } from "../../services/Api_Endpoint";
import { logout } from "../redux/Slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { removeSelectedUser, setSelectedUser } from "../redux/Slice/userSlice";

export const SideBar = ({ socket }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userdata, setUserdata] = useState([]);
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch all users from API
  const fetchUsers = async () => {
    try {
      const resp = await axios.get(`${Baseurl}/api/Auth/get_user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is sent
        },
      });

      console.log("API Response:", resp.data); // Debugging API response

      if (resp.data && resp.data.success && Array.isArray(resp.data.users)) {
        setUserdata(resp.data.users); // Update state with fetched users
      } else {
        console.error("Unexpected API response structure", resp.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  // Handle user search
  const handleSearch = (value) => setSearch(value);

  // Filter users to exclude the logged-in user and apply the search filter
  const filteredUsers = userdata
    .filter((curUser) => user?._id && curUser._id !== user._id)
    .filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()));

  // Debugging logs
  useEffect(() => {
    console.log("Filtered Users:", filteredUsers);
    console.log("User Data:", userdata);
    console.log("Logged-in User:", user);
  }, [userdata, search]);

  // Handle user logout
  const handleLogout = () => {
    dispatch(logout());
    if (socket) {
      socket.disconnect();
    }
    dispatch(removeSelectedUser());
    navigate("/login");
  };

  // Handle user selection for chat
  const handleUserSelect = (selectedUser) => {
    dispatch(setSelectedUser(selectedUser)); // sets the selected user in Redux
    setSidebarOpen(false);
  };

  // Listen for online users from socket
  useEffect(() => {
    if (socket) {
      socket.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }

    return () => {
      if (socket) {
        socket.off("getUsers");
      }
    };
  }, [socket]);

  // Check if a user is online
  const isUserOnline = (userId) => onlineUsers.some((onlineUser) => onlineUser.userId === userId);

  return (
    <>
      {/* Toggle Button for Sidebar */}
      <button
        className="md:hidden fixed top-4 left-0 text-[12px] z-50 p-2 bg-[#F0F2F5] text-black rounded-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar fixed top-0 left-0 max-h-screen bg-[#FFFFFF] z-10 shadow-lg transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:block w-70 overflow-y-scroll h-screen py-6 px-4`}
      >
        {/* Search & Logout */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between md:mt-0 mt-11">
          {/* Search Bar */}
          <input
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            type="text"
            placeholder="Search users..."
            className="w-full md:w-2/3 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-500 text-gray-800 font-semibold transition duration-300"
          />

          {/* Profile & Logout */}
          <div className="relative font-[sans-serif] mt-4 md:mt-0 md:ml-4">
            <button
              type="button"
              className="flex items-center rounded-full text-[#333] text-sm outline-none"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={user?.profile || "/default-avatar.png"}
                className="w-9 h-9 rounded-full"
                alt="Profile"
              />
            </button>

            <ul
              className={`absolute right-0 mt-2 shadow-lg bg-white py-2 z-[1000] min-w-24 w-15 rounded-lg max-h-60 overflow-x-hidden ${isDropdownOpen ? "block" : "hidden"}`}
            >
              <li className="py-2.5 px-5 gap-[8px] flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
                <CiHome />
                Home
              </li>
              <li
                onClick={handleLogout}
                className="py-2.5 px-5 flex gap-[8px] items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer"
              >
                <CiLogout />
                Logout
              </li>
            </ul>
          </div>
        </div>

        {/* List of Users for Chat */}
        <div className="my-8 flex-1">
          <h6 className="text-sm text-gray-700 font-semibold mb-6">Chat with Users</h6>
          {filteredUsers.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <ul className="space-y-6">
              {filteredUsers.map((curUser) => (
                <li
                  key={curUser._id}
                  onClick={() => handleUserSelect(curUser)}
                  className="flex items-center text-sm text-black hover:text-blue-500 cursor-pointer"
                >
                  <span className="relative inline-block mr-4">
                    <img
                      src={curUser.profile || "/default-avatar.png"}
                      className="ml-[13px] rounded-full w-[50px] h-[50px] object-cover"
                      alt="Profile"
                    />
                    {isUserOnline(curUser._id) && (
                      <span className="h-2.5 w-2.5 rounded-full bg-green-600 block absolute bottom-1 right-0"></span>
                    )}
                  </span>
                  <span className="font-medium">{curUser.name || "Unnamed User"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
