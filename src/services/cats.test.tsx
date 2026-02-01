import { MantineProvider } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCats } from "../__tests__/mocks/handlers";
import {
  deleteCat,
  downVoteCat,
  favouriteCat,
  postCat,
  unFavouriteCat,
  upVoteCat,
  useCats,
  useVotes,
} from "./cats";

vi.mock("@mantine/notifications", () => ({
  notifications: {
    show: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
};

describe("cats.ts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCats", () => {
    it("should fetch cats successfully", async () => {
      const { result } = renderHook(() => useCats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockCats);
      expect(result.current.data).toHaveLength(3);
      expect(result.current.data?.[0].id).toBe("cat-1");
    });

    it("should handle fetch errors", async () => {
      const { server } = await import("../__tests__/mocks/setup");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.get("https://api.thecatapi.com/v1/images/", () => {
          return HttpResponse.json({ error: "Server error" }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useCats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          color: "red",
          title: "Request failed",
          message: "Could not retrieve cats.",
        }),
      );
    });
  });

  describe("useVotes", () => {
    it("should fetch and process votes correctly", async () => {
      const { result } = renderHook(() => useVotes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // cat-1 has 2 upvotes (+1, +1) = +2
      // cat-2 has 1 downvote (-1) = -1
      expect(result.current.data).toEqual({
        "cat-1": 2,
        "cat-2": -1,
      });
    });

    it("should show warning when vote limit is reached", async () => {
      const { server } = await import("../__tests__/mocks/setup");
      const { http, HttpResponse } = await import("msw");

      // Mock 100 votes to trigger the limit warning
      const lotsOfVotes = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        image_id: "cat-1",
        value: 1,
      }));

      server.use(
        http.get("https://api.thecatapi.com/v1/votes", () => {
          return HttpResponse.json(lotsOfVotes);
        }),
      );

      const { result } = renderHook(() => useVotes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          color: "orange",
          title: "API Limit reached",
        }),
      );
    });
  });

  describe("postCat", () => {
    it("should upload a cat image successfully", async () => {
      const file = new Blob(["fake image"], { type: "image/jpeg" });

      await expect(postCat(file)).resolves.not.toThrow();
    });

    it("should handle upload errors", async () => {
      const { server } = await import("../__tests__/mocks/setup");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.post("https://api.thecatapi.com/v1/images/upload", () => {
          return HttpResponse.json({ error: "Upload failed" }, { status: 400 });
        }),
      );

      const file = new Blob(["fake image"], { type: "image/jpeg" });

      await expect(postCat(file)).rejects.toThrow();
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          color: "red",
          message: "Failed to post the picture.",
        }),
      );
    });
  });

  describe("deleteCat", () => {
    it("should delete a cat successfully", async () => {
      await expect(deleteCat("cat-1")).resolves.not.toThrow();
    });

    it("should handle delete errors", async () => {
      const { server } = await import("../__tests__/mocks/setup");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.delete("https://api.thecatapi.com/v1/images/:id", () => {
          return HttpResponse.json({ error: "Delete failed" }, { status: 403 });
        }),
      );

      await expect(deleteCat("cat-1")).rejects.toThrow();
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          color: "red",
          message: "Failed to delete the picture.",
        }),
      );
    });
  });

  describe("favouriteCat", () => {
    it("should favourite a cat successfully", async () => {
      await expect(favouriteCat("cat-1")).resolves.not.toThrow();
    });

    it("should handle favourite errors", async () => {
      const { server } = await import("../__tests__/mocks/setup");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.post("https://api.thecatapi.com/v1/favourites", () => {
          return HttpResponse.json(
            { error: "Favourite failed" },
            { status: 400 },
          );
        }),
      );

      await expect(favouriteCat("cat-1")).rejects.toThrow();
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          color: "red",
          message: "Failed to favourite the picture.",
        }),
      );
    });
  });

  describe("unFavouriteCat", () => {
    it("should unfavourite a cat successfully", async () => {
      await expect(unFavouriteCat(123)).resolves.not.toThrow();
    });

    it("should handle unfavourite errors", async () => {
      const { server } = await import("../__tests__/mocks/setup");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.delete("https://api.thecatapi.com/v1/favourites/:id", () => {
          return HttpResponse.json(
            { error: "Unfavourite failed" },
            { status: 400 },
          );
        }),
      );

      await expect(unFavouriteCat(123)).rejects.toThrow();
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          color: "red",
          message: "Failed to un-favourite the picture.",
        }),
      );
    });
  });

  describe("voting", () => {
    it("should upvote a cat successfully", async () => {
      await expect(upVoteCat("cat-1")).resolves.not.toThrow();
    });

    it("should downvote a cat successfully", async () => {
      await expect(downVoteCat("cat-1")).resolves.not.toThrow();
    });

    it("should handle vote errors", async () => {
      const { server } = await import("../__tests__/mocks/setup");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.post("https://api.thecatapi.com/v1/votes", () => {
          return HttpResponse.json({ error: "Vote failed" }, { status: 400 });
        }),
      );

      await expect(upVoteCat("cat-1")).rejects.toThrow();
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          color: "red",
          message: "Failed to vote on the picture.",
        }),
      );
    });
  });
});
