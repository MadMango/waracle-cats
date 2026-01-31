import { ActionIcon } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favouriteCat, unFavouriteCat } from "@/services/cats";
import classes from "./FavouriteIcon.module.css";

type FavouriteIconProps = {
  catId: string;
  favourite?: { id: number } | null;
};

export default function FavouriteIcon({
  catId,
  favourite,
}: FavouriteIconProps) {
  const favouriteIcon = favourite ? <IconHeartFilled /> : <IconHeart />;

  const queryClient = useQueryClient();

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

  return (
    <ActionIcon
      className={classes["favourite-button"]}
      pos="absolute"
      color={favourite ? "red" : "cyan"}
      variant="white"
      top={5}
      right={5}
      radius="xl"
      size="lg"
      aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
      onClick={() => {
        if (favourite) {
          catUnFavourite.mutate(favourite.id);
        } else {
          catFavourite.mutate(catId);
        }
      }}
    >
      {favouriteIcon}
    </ActionIcon>
  );
}
