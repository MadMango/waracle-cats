import { AspectRatio, Grid, Image } from "@mantine/core";
import Scaffold from "@/components/Scaffold/Scaffold";
import { useCats } from "@/services/cats";
import "./Home.module.css";

type CatObject = {
  id: string;
  url: string;
};

export function HomePage() {
  const cats = useCats();

  return (
    <Scaffold>
      <Grid>
        {cats.data?.map(({ id, url }: CatObject) => {
          return (
            <Grid.Col key={id} span={{ base: 12, md: 6, lg: 3 }}>
              <AspectRatio ratio={4 / 3} maw={500} mx="auto">
                <Image radius="sm" src={url}></Image>
              </AspectRatio>
            </Grid.Col>
          );
        })}
      </Grid>
    </Scaffold>
  );
}
