import { ActionIcon, Group, Text } from "@mantine/core";
import { IconArrowDown, IconArrowUp, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCat, downVoteCat, upVoteCat, useVotes } from "@/services/cats";
import classes from "./Actions.module.css";

type ActionProps = {
  catId: string;
};

export default function Actions({ catId }: ActionProps) {
  const queryClient = useQueryClient();
  const votes = useVotes();
  const votesForThisCat = votes.data?.[catId];

  const optimisticUpdate = async (catId: string, upOrDown: -1 | 1) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ["votes"] });

    // Snapshot the previous value
    const previousVotes = queryClient.getQueryData<Record<string, number>>([
      "votes",
    ]);

    // Optimistically increment the vote count
    queryClient.setQueryData<Record<string, number>>(["votes"], (old) => {
      if (!old) return { [catId]: upOrDown };

      return {
        ...old,
        [catId]: (old[catId] || 0) + upOrDown,
      };
    });

    // Return a result with the snapshotted value
    return { previousVotes };
  };

  const upVote = useMutation({
    mutationFn: async (catId: string) => {
      await upVoteCat(catId);
    },
    onMutate: async (catId: string) => {
      optimisticUpdate(catId, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
  });

  const downVote = useMutation({
    mutationFn: async (catId: string) => {
      await downVoteCat(catId);
    },
    onMutate: async (catId: string) => {
      optimisticUpdate(catId, -1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
  });

  const catDelete = useMutation({
    mutationFn: async (catId: string) => {
      await deleteCat(catId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
    },
  });

  const voteCount = votesForThisCat ? Math.abs(votesForThisCat) : 0;
  const voteSign = Math.sign(votesForThisCat);
  let votePrefix = "";

  if (voteSign > 0) {
    votePrefix = "\u002B";
  } else if (voteSign < 0) {
    votePrefix = "\u2212";
  }

  return (
    <Group justify="space-between">
      <Group className={classes["cat-score"]} gap={0}>
        <ActionIcon
          variant="subtle"
          size="lg"
          radius={0}
          aria-label="Upvote"
          onClick={() => {
            upVote.mutate(catId);
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
            downVote.mutate(catId);
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
          catDelete.mutate(catId);
        }}
      >
        <IconTrash></IconTrash>
      </ActionIcon>
    </Group>
  );
}
