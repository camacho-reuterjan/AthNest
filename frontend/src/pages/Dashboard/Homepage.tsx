import { useEffect, useState } from "react";

const Homepage = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storage = localStorage.getItem("access_token")
      ? localStorage
      : sessionStorage;
    const id = storage.getItem("user_id");
    setUserId(id);
  }, []);

  return (
    <div>
      <h1>Welcome to AthNest!</h1>
      {userId && <p>Your ID: {userId}</p>}
    </div>
  );
};

export default Homepage;
