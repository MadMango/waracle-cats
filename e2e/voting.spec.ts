import { expect, test } from "@playwright/test";

test.describe("Voting Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for cats to load
    await page.waitForSelector('img[src*="thecatapi"]', { timeout: 10000 });
  });

  test("should display cat images on home page", async ({ page }) => {
    const catImages = page.locator('img[src*="thecatapi"]');
    const count = await catImages.count();
    expect(count).toBeGreaterThan(0);
  });

  test("display delete buttons", async ({ page }) => {
    const deleteButton = page.getByLabel("Delete");
    const count = await deleteButton.count();
    expect(count).toBeGreaterThan(0);
  });

  test("display favourite buttons", async ({ page }) => {
    const favouriteButton = page.getByLabel("Add to favourites");
    const count = await favouriteButton.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should have upvote and downvote buttons", async ({ page }) => {
    const upvoteButton = page.getByLabel("Upvote").first();
    const downvoteButton = page.getByLabel("Downvote").first();

    await expect(upvoteButton).toBeVisible();
    await expect(downvoteButton).toBeVisible();
  });

  test("should increment vote count when upvoting", async ({ page }) => {
    const firstCard = page.getByTestId("cat-card").first();

    const voteText = firstCard.getByTestId("vote-result").first();
    const initialResult = await voteText.textContent();

    const upvoteButton = firstCard.getByLabel("Upvote");
    await upvoteButton.click();

    // Wait a bit for the optimistic update
    await page.waitForTimeout(200);

    const newResult = await voteText.textContent();
    expect(Number(newResult)).toBeGreaterThan(Number(initialResult));
  });

  test("should decrement vote count when downvoting", async ({ page }) => {
    const firstCard = page.getByTestId("cat-card").first();

    const voteText = firstCard.getByTestId("vote-result").first();
    const initialResult = await voteText.textContent();

    const downvoteButton = firstCard.getByLabel("Downvote");
    await downvoteButton.click();

    // Wait a bit for the optimistic update
    await page.waitForTimeout(200);

    const newResult = (await voteText.textContent())?.replace("−", "-"); // replace the unicode minus sign that is better for styling with an actual minus sign
    expect(Number(newResult)).toBeLessThan(Number(initialResult));
  });
});
