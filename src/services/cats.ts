import { useQuery } from "@tanstack/react-query";

const VITE_CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;

const getCats = async () => {
  var myHeaders = new Headers();
  myHeaders.append("x-api-key", VITE_CAT_API_KEY);

  const response = await fetch(
    "https://api.thecatapi.com/v1/images/?limit=10",
    {
      headers: myHeaders,
    },
  );

  if (!response.ok) {
    console.error("Get cat endpoint failed", {
      status: response.status,
    });

    throw new Error(`Response status: ${response.status}`);
  }

  const catsData = await response.json();

  return catsData;
};

export const postCat = async (file: Blob) => {
  var myHeaders = new Headers();
  myHeaders.append("x-api-key", VITE_CAT_API_KEY);

  var formdata = new FormData();
  formdata.append("file", file, "cat.jpeg");

  var requestOptions = {
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

    throw new Error(response.statusText ? response.statusText : text);
  }
};

export const useCats = () => useQuery({ queryKey: ["cats"], queryFn: getCats });
