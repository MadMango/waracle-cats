import {
  ActionIcon,
  Anchor,
  AppShell,
  Burger,
  Flex,
  Group,
  NavLink,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
  IconHome,
  IconUpload,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";

const links = [
  {
    destination: "/",
    name: "Home",
    icon: <IconHome size={20}></IconHome>,
  },
  {
    destination: "/upload",
    name: "Upload",
    icon: <IconUpload size={20}></IconUpload>,
  },
];

const footerHeight = 40;

export default function Scaffold({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <AppShell
      header={{ height: 60, offset: true }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      footer={{ height: footerHeight }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
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
          <ColorSchemeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        {links.map(({ destination, name, icon }) => {
          return (
            <NavLink
              key={destination}
              href={destination}
              label={name}
              active={location.pathname === destination}
              leftSection={
                <ThemeIcon
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  size="lg"
                  variant="gradient"
                  radius="md"
                >
                  {icon}
                </ThemeIcon>
              }
              onClick={(e) => {
                e.preventDefault();
                navigate(destination);
              }}
            />
          );
        })}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer>
        <Flex
          mih={footerHeight}
          mah={footerHeight}
          align="center"
          justify="space-between"
        >
          <Text size="14" ml={16} truncate>
            <Anchor
              href="#"
              onClick={() => {
                alert("Upload cats!!!");
              }}
            >
              Terms and conditions
            </Anchor>
          </Text>
          <Group gap={0} justify="flex-end" wrap="nowrap">
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
              aria-label="Twitter"
              onClick={() => {
                alert(
                  "Such a nice icon, very strong connection between branding and the product, it would be such a shame if someone changed it to a single letter without any meaning.\n\nLike 'X'.",
                );
              }}
            >
              <IconBrandTwitter size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://www.youtube.com/results?search_query=funny+cats"
              target="_blank"
              aria-label="Open YouTube in a new tab"
              size="lg"
              color="gray"
              variant="subtle"
            >
              <IconBrandYoutube size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://www.instagram.com/cats_of_instagram/?hl=en"
              aria-label="Open Instagram in a new tab"
              target="_blank"
              size="lg"
              color="gray"
              variant="subtle"
            >
              <IconBrandInstagram size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}
