import {
  type MantineColorScheme,
  SegmentedControl,
  useMantineColorScheme,
} from "@mantine/core";
import { useEffect, useState } from "react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const [colourScheme, setColourScheme] = useState("auto");

  useEffect(() => {
    setColorScheme(colourScheme as MantineColorScheme);
  }, [colourScheme, setColorScheme]);

  return (
    <SegmentedControl
      value={colourScheme}
      onChange={setColourScheme}
      data={[
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Auto", value: "auto" },
      ]}
    />
  );
}
