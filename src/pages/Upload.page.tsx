import {
  AspectRatio,
  Button,
  FileButton,
  Group,
  Image,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Scaffold from "@/components/Scaffold/Scaffold";
import { postCat } from "@/services/cats";

export function UploadPage() {
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const catsMutation = useMutation({
    mutationFn: async (catFile: File) => {
      setUploading(true);
      await postCat(catFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      navigate("/");
    },
    onError(error) {
      setError(error.toString());
    },
    onSettled() {
      setUploading(false);
    },
  });

  const [catPicture, setCatPicture] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>();

  useEffect(() => {
    if (catPicture) {
      console.info("picture", { catPicture, type: catPicture.type });
      if (!["image/png", "image/jpeg"].includes(catPicture.type)) {
        setError("Wrong file type selected");
        setCatPicture(null);
        return;
      }

      setError(null);
      setImagePreviewURL(URL.createObjectURL(catPicture));
    } else {
      setImagePreviewURL(null);
    }
  }, [catPicture]);

  const clearFile = () => {
    setCatPicture(null);
  };

  const uploadFile = () => {
    setCatPicture(null);
    catsMutation.mutate(catPicture!);
  };

  return (
    <Scaffold>
      <Stack align="center">
        <AspectRatio ratio={4 / 3} maw={600} mx="auto">
          <Image
            radius="md"
            src={imagePreviewURL}
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
          ></Image>
        </AspectRatio>

        <Text>For best results, use 4/3 aspect ratio images.</Text>
        <Group justify="center">
          <FileButton onChange={setCatPicture} accept="image/png,image/jpeg">
            {(props) => (
              <Button disabled={!!catPicture || isUploading} {...props}>
                Pick an image
              </Button>
            )}
          </FileButton>
          <Button
            disabled={!catPicture || isUploading}
            color="red"
            onClick={clearFile}
          >
            Reset
          </Button>
          <Button
            disabled={!catPicture || isUploading}
            color="green"
            onClick={uploadFile}
          >
            Upload
          </Button>
        </Group>

        {isUploading && (
          <Progress w={400} radius="xs" size="xl" value={50} striped animated />
        )}

        {error && (
          <Text c="red" fw={600}>
            {error}
          </Text>
        )}
      </Stack>
    </Scaffold>
  );
}
