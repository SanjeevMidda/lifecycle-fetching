import { useEffect, useMemo, useState } from "react";
import "./index.css";
import fetchUsers from "./services/userService";
import USERS from "./data/users";
import ROLES from "./data/roles";

function App() {
  const [userInput, setUserInput] = useState("");
  const [role, setRole] = useState("all");
  const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const usersData = await fetchUsers(USERS, role);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          />
          <label htmlFor="roleSelect">
            <select
              id="roleSelect"
              value={role}
              onChange={handleDropdownChange}
              disabled={loading}
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
            {loading ? loading : error ? "" : null}

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {filteredUsers.length === 0 && !loading && !error ? (
              <p>No users</p>
            ) : (
              filteredUsers.map((user) => (
                <div className="userinfoContainer" key={user.id}>
                  <p>{user.name}</p>
                  <p>{user.role}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
