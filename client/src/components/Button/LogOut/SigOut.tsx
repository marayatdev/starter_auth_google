import { Button } from "@mantine/core";
import axios from "axios";
import { googleLogout } from "@react-oauth/google";

export default function SigOut() {
  const handleLogout = () => {
    try {
      axios.get("/api/auth/logout");
      googleLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <Button onClick={handleLogout}>SigOut</Button>;
}
