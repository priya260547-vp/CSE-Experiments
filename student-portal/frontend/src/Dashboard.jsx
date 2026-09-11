import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard">
      <nav>
        <h2>🎓 Student Portal</h2>

        <div>
          <span>
            {user?.name} ({user?.role})
          </span>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <main>
        <h1>Welcome, {user?.name}! 👋</h1>

        <p>
          You are logged in as a{" "}
          <b>{user?.role}</b>.
        </p>

        <div className="cards">

          <div className="card">
            <h3>👤 Profile</h3>

            <p>
              View your profile information.
            </p>

            <button
              onClick={() => navigate("/profile")}
            >
              View Profile
            </button>
          </div>

          {user?.role === "admin" && (
            <div className="card">
              <h3>👩‍💼 Manage Students</h3>

              <p>
                Admin can manage students.
              </p>

              <button
                onClick={() =>
                  navigate("/students")
                }
              >
                Manage Students
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Dashboard;