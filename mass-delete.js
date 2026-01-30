import { loadEnvFile } from "node:process";

loadEnvFile("./.env.local");

(async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-api-key", process.env.VITE_CAT_API_KEY);

  const getVotesResponse = await fetch("https://api.thecatapi.com/v1/votes", {
    headers: myHeaders,
  });

  const votes = await getVotesResponse.json();

  console.warn(`Deleting ${votes.length} votes`);

  if (votes.length === 0) {
    process.exit(0);
  }
  console.warn("here's what a vote looks like", votes[0]);

  for (const voteIndex in votes) {
    const voteId = votes[voteIndex].id;

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "manual",
    };

    console.info("Deleting vote ", voteId);
    await fetch(`https://api.thecatapi.com/v1/votes/${voteId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }
})();
