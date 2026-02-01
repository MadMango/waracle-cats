import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as catsService from "@/services/cats";
import FavouriteIcon from "./FavouriteIcon";

vi.mock("@/services/cats", async () => {
  return {
    favouriteCat: vi.fn(),
    unFavouriteCat: vi.fn(),
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

describe("FavouriteIcon Component", () => {
  it("should render an empty heart icon when cat is not a favourite", () => {
    render(<FavouriteIcon catId="cat-1" favourite={null} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByLabelText("Add to favourites");
    expect(button).toBeInTheDocument();

    const svg = button.children[0].children[0];
    expect(svg).toHaveClass("tabler-icon tabler-icon-heart");
  });

  it("should render a filled heart icon when cat is a favourite", () => {
    render(<FavouriteIcon catId="cat-1" favourite={{ id: 123 }} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByLabelText("Remove from favourites");
    expect(button).toBeInTheDocument();

    const svg = button.children[0].children[0];
    expect(svg).toHaveClass("tabler-icon tabler-icon-heart-filled");
  });

  it("should call favouriteCat when cat is not a favourite", async () => {
    const user = userEvent.setup();

    render(<FavouriteIcon catId="cat-1" favourite={null} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByLabelText("Add to favourites");
    await user.click(button);

    expect(catsService.favouriteCat).toHaveBeenCalledWith("cat-1");
  });

  it("should call unFavouriteCat when cat is a favourite", async () => {
    const user = userEvent.setup();

    render(<FavouriteIcon catId="cat-1" favourite={{ id: 123 }} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByLabelText("Remove from favourites");
    await user.click(button);

    expect(catsService.unFavouriteCat).toHaveBeenCalledWith(123);
  });
});
