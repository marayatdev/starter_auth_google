import { useEffect, useState } from "react";
import {
  Anchor,
  Burger,
  Button,
  Container,
  Group,
  Paper,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Navbar.module.css";
import { User } from "../../../interfaces/Auth/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import axios from "axios";

export interface UserMe {
  id?: number;
  email?: string;
  role?: string;
  name?: string;
}

export function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);

  const [data, setData] = useState<User>();
  const user: User | null = useUser();

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      // console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // const links = data?.role === "2"
  //   ? [{ label: "กลับโหมดแอดมิน", link: "/admin" },
  //     /* { label: "เพิ่มอาจารย์", link: `/teacher/${data?.generation}` }, */
  //   ]
  //   : [
  //     { label: "หน้าแรก", link: "/" },
  //     ...(isAuth
  //       ? [
  //         { label: "หนังสือรุ่น", link: `/books/${data?.generation}` },
  //         { label: "โปรไฟล์", link: `/profile/${data?.userId}` },
  //         ...(data?.friendship_state === 2
  //           ? [
  //             { label: "เฟรนชิพ", link: `/preview/${data?.profileId}` },
  //             { label: "แก้ไขเฟรนชิพ", link: `/friendship/${data?.userId}` },
  //           ]
  //           : []),
  //       ]
  //       : []),
  //   ];

  //@ts-ignore
  // const [active, setActive] = useState(links[0].link);

  // const items = links.map((link) => (
  //   <Anchor
  //     key={link.label}
  //     style={{
  //       backgroundColor: location.pathname === link.link ? "#f775a9" : "transparent", // สีพื้นหลังเปลี่ยนตามสถานะ active
  //       padding: "5px 10px",
  //     }}
  //     //   href={link.link}
  //     className={classes.link}
  //     //   data-active={active === link.link || undefined}
  //     data-active={location.pathname === link.link || undefined}
  //     onClick={() => {
  //       setActive(link.link);
  //       navigate(link.link);
  //     }}
  //     underline="never"
  //   >
  //     {link.label}
  //   </Anchor>
  // ));

  return (
    <header className={classes.header}>
      <Container size={"xl"} className={classes.inner}>
        <Text
          size="xl"
          fz={28}
          fw={900}
          variant="gradient"
          gradient={{ from: "pink", to: "cyan", deg: 90 }}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          YearBooks {user}
        </Text>
        <Paper
          bg={"#fedbe4"}
          p={5}
          withBorder
          radius="xl"
          style={{ border: "2px solid #f77dae" }}
        >
          <Group gap={15} visibleFrom="xs">
            {/* {items} */}
          </Group>
        </Paper>

        <Group gap={5} visibleFrom="xs">
          {/* {user.email} */}
          {/* {isAuth ? (
            <>
              {data?.username}
              <SigOut />
            </>
          ) : (
            <>
              <Button
                variant="light"
                radius={"xl"}
                c={"white"}
                bg={"#f775a9"}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </>
          )} */}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
