import { expect, test } from "@playwright/test";

const pngBase64Signature =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

test.describe("Upload Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/upload");
  });

  test("should display upload page with all controls and hints", async ({
    page,
  }) => {
    await expect(page.getByText("Pick an image")).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Upload" })).toBeVisible();
    await expect(
      page.getByText("For best results, use 4:3 aspect ratio"),
    ).toBeVisible();
  });

  test("should have upload and reset buttons disabled initially", async ({
    page,
  }) => {
    const uploadButton = page.getByRole("button", { name: "Upload" });
    const resetButton = page.getByRole("button", { name: "Reset" });

    await expect(uploadButton).toBeDisabled();
    await expect(resetButton).toBeDisabled();
  });

  test("should enable buttons after selecting a file", async ({ page }) => {
    const fileContent = Buffer.from(pngBase64Signature, "base64");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-cat.png",
      mimeType: "image/png",
      buffer: fileContent,
    });

    const uploadButton = page.getByRole("button", { name: "Upload" });
    const resetButton = page.getByRole("button", { name: "Reset" });

    await expect(uploadButton).toBeEnabled();
    await expect(resetButton).toBeEnabled();
  });

  test("should disable pick button when file is selected", async ({ page }) => {
    const fileContent = Buffer.from(pngBase64Signature, "base64");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-cat.png",
      mimeType: "image/png",
      buffer: fileContent,
    });

    const pickButton = page.getByRole("button", { name: "Pick an image" });
    await expect(pickButton).toBeDisabled();
  });

  test("should show image preview when file is selected", async ({ page }) => {
    const fileContent = Buffer.from(pngBase64Signature, "base64");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-cat.png",
      mimeType: "image/png",
      buffer: fileContent,
    });

    await page.waitForTimeout(500);

    const image = page.locator("img").first();
    const src = await image.getAttribute("src");
    expect(src).toContain("blob:");
  });

  test("should clear file when reset button is clicked", async ({ page }) => {
    const fileContent = Buffer.from(pngBase64Signature, "base64");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-cat.png",
      mimeType: "image/png",
      buffer: fileContent,
    });

    // buttons should be enabled
    const uploadButton = page.getByRole("button", { name: "Upload" });
    await expect(uploadButton).toBeEnabled();

    // click reset
    const resetButton = page.getByRole("button", { name: "Reset" });
    await resetButton.click();

    // buttons should be disabled again
    await expect(uploadButton).toBeDisabled();
    await expect(resetButton).toBeDisabled();

    // image src should go back to placeholder
    const image = page.locator("img").first();
    const src = await image.getAttribute("src");
    expect(src).toContain("placehold.co");
  });

  test("should show error for invalid file type", async ({ page }) => {
    const fileContent = Buffer.from("This is not an image file");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test.txt",
      mimeType: "text/plain",
      buffer: fileContent,
    });

    await expect(page.getByText("Wrong file type selected")).toBeVisible();
  });

  test("should show error when upload fails", async ({ page }) => {
    const fileContent = Buffer.from(pngBase64Signature, "base64");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-cat.png",
      mimeType: "image/png",
      buffer: fileContent,
    });

    const uploadButton = page.getByRole("button", { name: "Upload" });
    await uploadButton.click();

    await expect(
      page.getByText("Error: Classifcation failed: correct animal not found."),
    ).toBeVisible({ timeout: 10000 });
  });

  test("should show progress bar during upload", async ({ page }) => {
    const fileContent = Buffer.from(pngBase64Signature, "base64");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-cat.png",
      mimeType: "image/png",
      buffer: fileContent,
    });

    const uploadButton = page.getByRole("button", { name: "Upload" });
    await uploadButton.click();

    const progressBar = page.getByRole("progressbar");
    await expect(progressBar).toBeVisible({ timeout: 1000 });
  });

  test("should redirect to home page on successful upload", async ({
    page,
  }) => {
    await page.route("*/**/v1/images/upload", async (route) => {
      await route.fulfill({});
    });

    await expect(page).toHaveURL("/upload");

    const fileContent = Buffer.from(pngBase64Signature, "base64");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-cat.png",
      mimeType: "image/png",
      buffer: fileContent,
    });

    // click upload button
    const uploadButton = page.getByRole("button", { name: "Upload" });
    await uploadButton.click();

    // back on home page
    await expect(page).toHaveURL("/");
  });
});
