import { useEffect, useState } from "react";
import api from "./api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/api/profile")
      .then((response) => {
        setProfile(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!profile) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="page">
      <h1>👤 My Profile</h1>

      <div className="profile-card">
        <h2>{profile.name}</h2>

        <p>
          <b>User ID:</b> {profile.id}
        </p>

        <p>
          <b>Role:</b> {profile.role}
        </p>
      </div>
    </div>
  );
}

export default Profile;