// frontend/src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">👤 Registered Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-[#1E293B] text-white">
              <th className="px-4 py-2">ID Tag</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Card Number</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.idTag}
                className="border-b border-gray-700 hover:bg-[#1E293B]/50"
              >
                <td className="px-4 py-2">{u.idTag}</td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.department}</td>
                <td className="px-4 py-2">{u.cardNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
