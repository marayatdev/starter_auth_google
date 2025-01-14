import { AppShell, BackgroundImage } from "@mantine/core";
import { Navbar } from "./Navbar/Navbar";
import { Container } from "@mantine/core";
import { ReactNode } from "react";

interface DefaultStyleProps {
  children: ReactNode;
}
export default function DefaultStyle({ children }: DefaultStyleProps) {
  return (
    <BackgroundImage style={{ backgroundPosition: "contain", backgroundSize: "cover", backgroundRepeat: "no-repeat" }} src={`/main-bg.png`} mih={"100vh"}>
      <AppShell header={{ height: 80 }} padding="md">
        <AppShell.Header>
          <div>
            <Navbar />
          </div>
        </AppShell.Header>

        <Container size="xl">
          <AppShell.Main bg={"#00023"}>{children}</AppShell.Main>
        </Container>
      </AppShell>
    </BackgroundImage>
  );
}
