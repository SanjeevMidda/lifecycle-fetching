import { useEffect, useMemo, useState } from "react";
import "./index.css";
import fetchUsers from "./services/userService";
import USERS from "./data/users";
import ROLES from "./data/roles";
import deleteUser from "./services/deleteUser";

function App() {
  const [userInput, setUserInput] = useState("");
  const [role, setRole] = useState("all");
  const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);

  const loadUsers = async () => {
    setStatus("loading");
    setError(null);

    try {
      const usersData = await fetchUsers(USERS, role);
      setUsers(usersData);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleInputChange = (e) => setUserInput(e.target.value);

  const handleDropdownChange = (e) => {
    setRole(e.target.value);
  };

  const filteredUsers = useMemo(() => {
    const normalizedInput = userInput.trim().toLowerCase();

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedInput) &&
        (role === "all" || user.role.toLowerCase() === role)
    );
  }, [users, userInput, role]);

  const handleDeleteUser = async (userToDelete) => {
    const previousUsers = [...users];

    const userIndex = previousUsers.findIndex((u) => u.id === userToDelete.id);

    setDeletingIds((prev) => [...prev, userToDelete.id]);

    setUsers((prev) =>
      Array.isArray(prev) ? prev.filter((u) => u.id !== userToDelete.id) : []
    );

    try {
      await deleteUser(userToDelete.id);
    } catch (err) {
      setUsers((prev) => {
        if (prev.some((u) => u.id === userToDelete.id)) return prev;
        const newUsers = [...prev];
        newUsers.splice(userIndex, 0, userToDelete);
        return newUsers;
      });

      alert(err.message || "Failed to delete user");
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== userToDelete.id));
    }
  };

  useEffect(() => {
    loadUsers();
  }, [role]);

  return (
    <div className="App">
      <div id="title">
        <div className="circle"></div>
        <h1>Zable Admin</h1>
      </div>

      <div className="mainWrapper">
        <div className="filterContainer">
          <input
            type="text"
            id="nameFilter"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter name"
            aria-label="Filter users by name"
            disabled={status === "loading"}
          />
          <label htmlFor="roleSelect">
            <select
              id="roleSelect"
              value={role}
              onChange={handleDropdownChange}
              disabled={status === "loading"}
              aria-label="Filter users by role"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mainUserDataContainer">
          <div className="headings">
            <h2>NAME</h2>
            <h2>ROLE</h2>
          </div>

          <div className="userData">
            {status === "loading" && <p>Loading...</p>}
            {status === "error" && <p>Error: {error}</p>}

            {status === "success" &&
              (filteredUsers.length === 0 ? (
                <p>No users</p>
              ) : (
                filteredUsers.map((user) => (
                  <div className="userinfoContainer" key={user.id}>
                    <p>{user.name}</p>
                    <p>{user.role}</p>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      disabled={status === "loading"}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
