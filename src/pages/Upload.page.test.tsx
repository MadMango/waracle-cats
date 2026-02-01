import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as catsService from "@/services/cats";
import { UploadPage } from "./Upload.page";

vi.mock("@/components/Scaffold/Scaffold", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scaffold">{children}</div>
  ),
}));

vi.mock("@/services/cats", async () => {
  return {
    postCat: vi.fn(),
  };
});

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient();

  return ({ children }: { children: React.ReactNode }) => (
    <MantineProvider>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    </MantineProvider>
  );
};

describe("UploadPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
  });

  it("should render upload form", () => {
    render(<UploadPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Pick an image")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();
  });

  it("should call postCat and navigate on successful upload", async () => {
    const user = userEvent.setup();

    render(<UploadPage />, { wrapper: createWrapper() });

    const file = new File(["cat image"], "cat.jpg", { type: "image/jpeg" });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(input, file);

    const uploadButton = await screen.findByText("Upload");
    await user.click(uploadButton);

    await waitFor(() => {
      expect(catsService.postCat).toHaveBeenCalledWith(file);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  // most of the logic is tested in e2e/upload.spec.ts
});
