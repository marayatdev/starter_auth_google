import axios from "axios";
import SigOut from "../../components/Button/LogOut/SigOut";
import DefaultStyle from "../../components/ui@system/DefaultStyle";

const RegisterStudent = () => {
  const handleSubmit = async () => {
    try {
      // const response = await axios.put("/api/auth/me");
      // console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <DefaultStyle>
      User Home
      {/* <SigOut /> */}
    </DefaultStyle>
  );
};

export default RegisterStudent;
