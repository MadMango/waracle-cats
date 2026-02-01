import { MantineProvider } from "@mantine/core";
import {
  QueryClient,
  QueryClientProvider,
  type UseQueryResult,
} from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as catsService from "@/services/cats";
import { HomePage } from "./Home.page";

type CatImage = { id: string; url: string; favourite: { id: number } | null };

vi.mock("@/components/Scaffold/Scaffold", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scaffold">{children}</div>
  ),
}));

vi.mock("@/components/Actions/Actions", () => ({
  default: ({ catId }: { catId: string }) => (
    <div data-testid={`actions-${catId}`}>Actions</div>
  ),
}));

vi.mock("@/components/FavouriteIcon/FavouriteIcon", () => ({
  default: ({ catId }: { catId: string }) => (
    <div data-testid={`favourite-${catId}`}>Favourite</div>
  ),
}));

vi.mock("@/components/NoCats/NoCats", () => ({
  default: () => <div data-testid="no-cats">No cats available</div>,
}));

vi.mock("@/services/cats", async () => {
  return {
    useCats: vi.fn(),
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient();

  return ({ children }: { children: React.ReactNode }) => (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
};

describe("HomePage", () => {
  it("should render with loading state when fetching", () => {
    vi.mocked(catsService.useCats).mockReturnValue({
      data: [],
      isFetching: true,
      isSuccess: true,
    } as unknown as UseQueryResult<CatImage[]>);

    const { container } = render(<HomePage />, { wrapper: createWrapper() });

    expect(
      container.querySelector('[class*="LoadingOverlay"]'),
    ).toBeInTheDocument();
  });

  it("should render NoCats component when no cats available", () => {
    vi.mocked(catsService.useCats).mockReturnValue({
      data: [],
      isFetching: false,
      isSuccess: true,
    } as unknown as UseQueryResult<CatImage[]>);

    render(<HomePage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("no-cats")).toBeInTheDocument();
  });

  it("should not render NoCats when cats are available", () => {
    const mockCats = [
      { id: "cat-1", url: "https://example.com/cat1.jpg", favourite: null },
    ];

    vi.mocked(catsService.useCats).mockReturnValue({
      data: mockCats,
      isFetching: false,
      isSuccess: true,
    } as unknown as UseQueryResult<CatImage[]>);

    render(<HomePage />, { wrapper: createWrapper() });

    expect(screen.queryByTestId("no-cats")).not.toBeInTheDocument();
  });

  it("should render cat cards when cats are available", () => {
    const mockCats = [
      { id: "cat-1", url: "https://example.com/cat1.jpg", favourite: null },
      {
        id: "cat-2",
        url: "https://example.com/cat2.jpg",
        favourite: { id: 123 },
      },
      { id: "cat-3", url: "https://example.com/cat3.jpg", favourite: null },
    ];

    vi.mocked(catsService.useCats).mockReturnValue({
      data: mockCats,
      isFetching: false,
      isSuccess: true,
    } as unknown as UseQueryResult<CatImage[]>);

    render(<HomePage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("actions-cat-1")).toBeInTheDocument();
    expect(screen.getByTestId("actions-cat-2")).toBeInTheDocument();
    expect(screen.getByTestId("actions-cat-3")).toBeInTheDocument();
    expect(screen.getByTestId("favourite-cat-1")).toBeInTheDocument();
    expect(screen.getByTestId("favourite-cat-2")).toBeInTheDocument();
    expect(screen.getByTestId("favourite-cat-3")).toBeInTheDocument();
  });

  it("should render cat images with correct URLs", () => {
    const mockCats = [
      { id: "cat-1", url: "https://example.com/cat1.jpg", favourite: null },
    ];

    vi.mocked(catsService.useCats).mockReturnValue({
      data: mockCats,
      isFetching: false,
      isSuccess: true,
    } as unknown as UseQueryResult<CatImage[]>);

    render(<HomePage />, { wrapper: createWrapper() });

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "https://example.com/cat1.jpg");
  });
});
