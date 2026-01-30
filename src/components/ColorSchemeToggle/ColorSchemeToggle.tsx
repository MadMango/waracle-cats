import {
  type MantineColorScheme,
  SegmentedControl,
  useMantineColorScheme,
} from "@mantine/core";

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      value={colorScheme}
      onChange={(value) => {
        setColorScheme(value as MantineColorScheme);
      }}
      data={[
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Auto", value: "auto" },
      ]}
    />
  );
}
