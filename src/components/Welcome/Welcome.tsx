import { Anchor, Text } from "@mantine/core";

export function Welcome() {
  return (
    <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
      This starter Vite project includes a minimal setup, if you want to learn
      more on Mantine + Vite integration follow{" "}
      <Anchor href="https://mantine.dev/guides/vite/" size="lg">
        this guide
      </Anchor>
      . To get started edit pages/Home.page.tsx file.
    </Text>
  );
}
