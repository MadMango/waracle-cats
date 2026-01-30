import {
  ActionIcon,
  Anchor,
  AspectRatio,
  Box,
  Card,
  Center,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Overlay,
  Paper,
  Space,
  Text,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconHeart,
  IconHeartFilled,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Scaffold from "@/components/Scaffold/Scaffold";
import {
  deleteCat,
  downVoteCat,
  favouriteCat,
  unFavouriteCat,
  upVoteCat,
  useCats,
  useVotes,
} from "@/services/cats";
import classes from "./Home.module.css";

type CatObject = {
  id: string;
  url: string;
  favourite: { id: number } | null;
};

export function HomePage() {
  const cats = useCats();
  const votes = useVotes();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const catDelete = useMutation({
    mutationFn: async (catId: string) => {
      await deleteCat(catId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
    },
  });

  const catFavourite = useMutation({
    mutationFn: async (catId: string) => {
      await favouriteCat(catId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
    },
  });

  const catUnFavourite = useMutation({
    mutationFn: async (favouriteId: number) => {
      await unFavouriteCat(favouriteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
    },
  });

  const upVote = useMutation({
    mutationFn: async (catId: string) => {
      await upVoteCat(catId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
  });

  const downVote = useMutation({
    mutationFn: async (catId: string) => {
      await downVoteCat(catId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
  });

  return (
    <Scaffold>
      <Box pos="relative">
        <LoadingOverlay
          visible={cats.isFetching}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        {(cats.data?.length || 0) === 0 && (
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
        )}
        <Grid>
          {cats.data?.map(({ id, url, favourite }: CatObject) => {
            const isCatFavourite = favourite;
            const favouriteIcon = isCatFavourite ? (
              <IconHeartFilled />
            ) : (
              <IconHeart />
            );

            const votesForThisCat = votes.data?.[id];
            const voteCount = votesForThisCat ? Math.abs(votesForThisCat) : 0;
            const voteSign = Math.sign(votesForThisCat);
            let votePrefix = "";

            if (voteSign > 0) {
              votePrefix = "\u002B";
            } else if (voteSign < 0) {
              votePrefix = "\u2212";
            }

            return (
              <Grid.Col key={id} span={{ base: 12, md: 6, lg: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <AspectRatio ratio={4 / 3} mx="auto">
                      <Image src={url}></Image>
                      <Overlay backgroundOpacity={0} opacity={1} zIndex={10}>
                        <ActionIcon
                          className={classes["favourite-button"]}
                          pos="absolute"
                          color={isCatFavourite ? "red" : "cyan"}
                          variant="white"
                          top={5}
                          right={5}
                          radius="xl"
                          size="lg"
                          aria-label={
                            isCatFavourite
                              ? "Remove from favourites"
                              : "Add to favourites"
                          }
                          onClick={() => {
                            if (isCatFavourite) {
                              catUnFavourite.mutate(favourite.id);
                            } else {
                              catFavourite.mutate(id);
                            }
                          }}
                        >
                          {favouriteIcon}
                        </ActionIcon>
                      </Overlay>
                    </AspectRatio>
                  </Card.Section>
                  <Card.Section>
                    <Group justify="space-between">
                      <Group className={classes["cat-score"]} gap={0}>
                        <ActionIcon
                          variant="subtle"
                          size="lg"
                          radius={0}
                          aria-label="Upvote"
                          onClick={() => {
                            upVote.mutate(id);
                          }}
                        >
                          <IconArrowUp size={22}></IconArrowUp>
                        </ActionIcon>

                        <ActionIcon
                          variant="subtle"
                          size="lg"
                          radius={0}
                          aria-label="Downvote"
                          onClick={() => {
                            downVote.mutate(id);
                          }}
                        >
                          <IconArrowDown size={22}></IconArrowDown>
                        </ActionIcon>
                        <Text ta="center">
                          &nbsp;
                          {votePrefix}
                          {voteCount}
                        </Text>
                      </Group>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="lg"
                        radius={0}
                        aria-label="Delete"
                        onClick={() => {
                          catDelete.mutate(id);
                        }}
                      >
                        <IconTrash></IconTrash>
                      </ActionIcon>
                    </Group>
                  </Card.Section>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </Box>
    </Scaffold>
  );
}
