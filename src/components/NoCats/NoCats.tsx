import { Anchor, Center, Paper, Space, Text } from "@mantine/core";
import { useNavigate } from "react-router";

export default function NoCats() {
  const navigate = useNavigate();

  return (
    <Center>
      <Paper w={400} shadow="xs" p="xl">
        <Text ta="center">There are no kitties here just yet.</Text>
        <Space h="md"></Space>
        <Text ta="center">
          <Anchor
            ta="center"
            onClick={(e) => {
              e.preventDefault();
              navigate("/upload");
            }}
          >
            Upload one?
          </Anchor>
        </Text>
      </Paper>
    </Center>
  );
}
