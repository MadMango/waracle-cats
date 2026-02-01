import {
  AspectRatio,
  Box,
  Card,
  Grid,
  Image,
  LoadingOverlay,
  Overlay,
} from "@mantine/core";
import Actions from "@/components/Actions/Actions";
import FavouriteIcon from "@/components/FavouriteIcon/FavouriteIcon";
import NoCats from "@/components/NoCats/NoCats";
import Scaffold from "@/components/Scaffold/Scaffold";
import { useCats } from "@/services/cats";
import "./Home.module.css";

type CatObject = {
  id: string;
  url: string;
  favourite: { id: number } | null;
};

export function HomePage() {
  const cats = useCats();

  return (
    <Scaffold>
      <Box pos="relative">
        <LoadingOverlay
          visible={cats.isFetching}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        {(cats.data?.length || 0) === 0 && <NoCats />}
        <Grid>
          {cats.data?.map(({ id, url, favourite }: CatObject) => {
            return (
              <Grid.Col key={id} span={{ base: 12, md: 6, xl: 3 }}>
                <Card
                  data-testid="cat-card"
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                >
                  <Card.Section>
                    <AspectRatio ratio={4 / 3} mx="auto">
                      <Image src={url}></Image>
                      <Overlay backgroundOpacity={0} opacity={1} zIndex={10}>
                        <FavouriteIcon catId={id} favourite={favourite} />
                      </Overlay>
                    </AspectRatio>
                  </Card.Section>
                  <Card.Section>
                    <Actions catId={id}></Actions>
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
