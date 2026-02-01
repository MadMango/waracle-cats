import { MantineProvider } from "@mantine/core";
import {
  QueryClient,
  QueryClientProvider,
  type UseQueryResult,
} from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as catsService from "@/services/cats";
import Actions from "./Actions";

const NBSP = "\u00A0";

vi.mock("@/services/cats", async () => {
  return {
    useVotes: vi.fn(),
    upVoteCat: vi.fn(),
    downVoteCat: vi.fn(),
    deleteCat: vi.fn(),
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

describe("Actions Component", () => {
  it("should render vote buttons and delete button", () => {
    vi.mocked(catsService.useVotes).mockReturnValue({
      data: { "cat-1": 5 },
    } as unknown as UseQueryResult<Record<string, number>>);

    render(<Actions catId="cat-1" />, { wrapper: createWrapper() });

    expect(screen.getByLabelText("Upvote")).toBeInTheDocument();
    expect(screen.getByLabelText("Downvote")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete")).toBeInTheDocument();
  });

  it("should display positive vote count with + prefix", () => {
    vi.mocked(catsService.useVotes).mockReturnValue({
      data: { "cat-1": 5 },
    } as unknown as UseQueryResult<Record<string, number>>);

    render(<Actions catId="cat-1" />, { wrapper: createWrapper() });

    expect(screen.getByText("+5")).toBeInTheDocument();
  });

  it("should display negative vote count with − prefix", () => {
    vi.mocked(catsService.useVotes).mockReturnValue({
      data: { "cat-1": -3 },
    } as unknown as UseQueryResult<Record<string, number>>);

    render(<Actions catId="cat-1" />, { wrapper: createWrapper() });

    expect(screen.getByText("−3")).toBeInTheDocument();
  });

  it("should display zero vote count without prefix", () => {
    vi.mocked(catsService.useVotes).mockReturnValue({
      data: {},
    } as unknown as UseQueryResult<Record<string, number>>);

    render(<Actions catId="cat-1" />, {
      wrapper: createWrapper(),
    });

    const voteCountText = screen.getByTestId("vote-result");
    expect(voteCountText?.textContent).toBe(`${NBSP}0`);
  });

  it("should call upVoteCat when upvote button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(catsService.useVotes).mockReturnValue({
      data: { "cat-1": 0 },
    } as unknown as UseQueryResult<Record<string, number>>);

    render(<Actions catId="cat-1" />, { wrapper: createWrapper() });

    const upvoteButton = screen.getByLabelText("Upvote");
    await user.click(upvoteButton);

    expect(catsService.upVoteCat).toHaveBeenCalledWith("cat-1");
  });

  it("should call downVoteCat when downvote button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(catsService.useVotes).mockReturnValue({
      data: { "cat-1": 0 },
    } as unknown as UseQueryResult<Record<string, number>>);

    render(<Actions catId="cat-1" />, { wrapper: createWrapper() });

    const downvoteButton = screen.getByLabelText("Downvote");
    await user.click(downvoteButton);

    expect(catsService.downVoteCat).toHaveBeenCalledWith("cat-1");
  });

  it("should call deleteCat when delete button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(catsService.useVotes).mockReturnValue({
      data: { "cat-1": 0 },
    } as unknown as UseQueryResult<Record<string, number>>);

    render(<Actions catId="cat-1" />, { wrapper: createWrapper() });

    const deleteButton = screen.getByLabelText("Delete");
    await user.click(deleteButton);

    expect(catsService.deleteCat).toHaveBeenCalledWith("cat-1");
  });
});
