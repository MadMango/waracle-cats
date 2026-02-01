import { HttpResponse, http } from "msw";

const API_BASE = "https://api.thecatapi.com/v1";

export const mockCats = [
  {
    id: "cat-1",
    url: "https://cdn2.thecatapi.com/images/cat-1.jpg",
  },
  {
    id: "cat-2",
    url: "https://cdn2.thecatapi.com/images/cat-2.jpg",
  },
  {
    id: "cat-3",
    url: "https://cdn2.thecatapi.com/images/cat-3.jpg",
  },
];

const mockVotes = [
  { id: 1, image_id: "cat-1", value: 1 },
  { id: 2, image_id: "cat-1", value: 1 },
  { id: 3, image_id: "cat-2", value: -1 },
];

export const handlers = [
  http.get(`${API_BASE}/images/`, () => {
    return HttpResponse.json(mockCats);
  }),

  http.get(`${API_BASE}/votes`, () => {
    return HttpResponse.json(mockVotes);
  }),

  http.post(`${API_BASE}/votes`, async () => {
    return HttpResponse.json({});
  }),

  http.post(`${API_BASE}/images/upload`, async () => {
    return HttpResponse.json({});
  }),

  http.delete(`${API_BASE}/images/:id`, () => {
    return HttpResponse.json({});
  }),

  http.post(`${API_BASE}/favourites`, async () => {
    return HttpResponse.json({});
  }),

  http.delete(`${API_BASE}/favourites/:id`, () => {
    return HttpResponse.json({});
  }),
];
