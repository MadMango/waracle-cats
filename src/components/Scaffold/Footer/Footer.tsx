import { ActionIcon, Anchor, Flex, Group, Text } from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";

export const footerHeight = 40;

export default function Footer() {
  return (
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
  );
}
