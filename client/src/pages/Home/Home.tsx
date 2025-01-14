import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SigOut from "../../components/Button/LogOut/SigOut";
import DefaultStyle from "../../components/ui@system/DefaultStyle";
const Home = () => {
  const navigate = useNavigate();

  const checkToken = async () => {
    try {
      const response = await axios.get("/api/auth/check");
      console.log(response.data);
    } catch (error) {
      console.error("Check token error:", error);
    }
  };
  const checkme = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      console.log(response.data);
    } catch (error) {
      console.error("Check token error:", error);
    }
  };

  return (
    <DefaultStyle>
      Home Page
      <Button onClick={() => navigate("/login")}>Login</Button>
      <SigOut />
      <Button onClick={checkToken}>check</Button>
      <Button onClick={checkme}>getMe</Button>
    </DefaultStyle>
  );
};

export default Home;
