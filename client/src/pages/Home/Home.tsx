import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      axios.get("/api/auth/logout");
      googleLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkToken = async () => {
    try {
      const response = await axios.get("/api/auth/check");
      console.log(response.data);
    } catch (error) {
      console.error("Check token error:", error);
    }
  };

  return (
    <>
      Home Page
      <Button onClick={() => navigate("/login")}>Login</Button>
      <Button
        onClick={handleLogout}
        color="red"
        variant="filled"
        radius="md"
        size="md"
      >
        Sign Out
      </Button>
      <Button onClick={checkToken}>check</Button>
    </>
  );
};

export default Home;
