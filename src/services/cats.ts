import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";

const VITE_CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;

const showApiError = (message: string) => {
  notifications.show({
    color: "red",
    title: "Request failed",
    message,
  });
};

const getCats = async () => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", VITE_CAT_API_KEY);

  const response = await fetch(
    "https://api.thecatapi.com/v1/images/?limit=100",
    {
      headers: myHeaders,
    },
  );

  if (!response.ok) {
    console.error("Get cat endpoint failed", {
      status: response.status,
    });

    showApiError("Could not retrieve cats.");

    throw new Error(`Response status: ${response.status}`);
  }

  const catsData = await response.json();

  return catsData;
};

const processVotes = (
  votes: Array<{
    image_id: string;
    value: number;
  }>,
) => {
  const countedVotes = Object.create(null);
  for (const vote of votes) {
    const currentVotes = countedVotes[vote.image_id] ?? 0;
    countedVotes[vote.image_id] = currentVotes + Math.sign(vote.value);
  }

  if (votes.length === 100) {
    notifications.show({
      color: "orange",
      title: "API Limit reached",
      message:
        "You have cast 100 or more votes, the API cannot return more that that. Vote count might be inaccurate.",
    });
  }
  return countedVotes;
};

const getVotes = async () => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", VITE_CAT_API_KEY);

  const response = await fetch("https://api.thecatapi.com/v1/votes", {
    headers: myHeaders,
  });

  if (!response.ok) {
    console.error("Get votes endpoint failed", {
      status: response.status,
    });

    showApiError("Could not retrieve votes.");

    throw new Error(`Response status: ${response.status}`);
  }

  const votesData = await response.json();
  const countedVotes = processVotes(votesData);
  return countedVotes;
};

export const postCat = async (file: Blob) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", VITE_CAT_API_KEY);

  const formdata = new FormData();
  formdata.append("file", file, "cat.jpeg");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
  };

  const response = await fetch(
    "https://api.thecatapi.com/v1/images/upload",
    requestOptions,
  );
  if (!response.ok) {
    const text = await response.text();
    const statusText = response.statusText;

    console.error("Post to cat endpoint failed", {
      status: response.status,
      text,
      statusText,
    });
    showApiError("Failed to post the picture.");

    throw new Error(response.statusText ? response.statusText : text);
  }
};

export const deleteCat = async (id: string) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", VITE_CAT_API_KEY);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: "",
  };

  const response = await fetch(
    `https://api.thecatapi.com/v1/images/${id}`,
    requestOptions,
  );
  if (!response.ok) {
    const text = await response.text();
    const statusText = response.statusText;

    console.error("Delete cat endpoint failed", {
      status: response.status,
      text,
      statusText,
    });
    showApiError("Failed to delete the picture.");

    throw new Error(response.statusText ? response.statusText : text);
  }
};

export const favouriteCat = async (id: string) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", VITE_CAT_API_KEY);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    image_id: id,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const response = await fetch(
    `https://api.thecatapi.com/v1/favourites`,
    requestOptions,
  );

  if (!response.ok) {
    const text = await response.text();
    const statusText = response.statusText;

    console.error("Favourite cat endpoint failed", {
      status: response.status,
      text,
      statusText,
    });
    showApiError("Failed to favourite the picture.");

    throw new Error(response.statusText ? response.statusText : text);
  }
};

export const unFavouriteCat = async (favouriteId: number) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", VITE_CAT_API_KEY);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
  };

  const response = await fetch(
    `https://api.thecatapi.com/v1/favourites/${favouriteId}`,
    requestOptions,
  );

  if (!response.ok) {
    const text = await response.text();
    const statusText = response.statusText;

    console.error("UnFavourite cat endpoint failed", {
      status: response.status,
      text,
      statusText,
    });
    showApiError("Failed to un-favourite the picture.");

    throw new Error(response.statusText ? response.statusText : text);
  }
};

const vote = (value: number) => async (catId: string) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", VITE_CAT_API_KEY);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    image_id: catId,
    value,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  const response = await fetch(
    `https://api.thecatapi.com/v1/votes`,
    requestOptions,
  );

  if (!response.ok) {
    const text = await response.text();
    const statusText = response.statusText;

    console.error("Cat vote endpoint failed", {
      status: response.status,
      text,
      statusText,
    });
    showApiError("Failed to vote on the picture.");

    throw new Error(response.statusText ? response.statusText : text);
  }
};

export const upVoteCat = vote(1);
export const downVoteCat = vote(-1);

export const useCats = () => useQuery({ queryKey: ["cats"], queryFn: getCats });
export const useVotes = () =>
  useQuery({ queryKey: ["votes"], queryFn: getVotes });
