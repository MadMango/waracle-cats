import { NavLink, ThemeIcon } from "@mantine/core";
import { IconHome, IconUpload } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";

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

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
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
    </>
  );
}
