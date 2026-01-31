import { AppShell, Burger, Flex, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import Footer, { footerHeight } from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";

export default function Scaffold({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60, offset: true }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      footer={{ height: footerHeight }}
      padding="md"
    >
      <AppShell.Header>
        <Group justify="space-between" wrap="nowrap" h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text>
            Welcome to{" "}
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={{ from: "indigo", to: "cyan" }}
            >
              The Cat App
            </Text>
          </Text>
          <Flex visibleFrom="sm">
            <ColorSchemeToggle />
          </Flex>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Flex justify="flex-end" p={8} hiddenFrom="sm">
          <ColorSchemeToggle />
        </Flex>
        <Navbar></Navbar>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer>
        <Footer></Footer>
      </AppShell.Footer>
    </AppShell>
  );
}
