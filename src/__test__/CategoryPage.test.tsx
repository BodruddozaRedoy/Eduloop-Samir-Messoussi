import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import CategoryPage from "@/pages/Category/CategoryPage";

// 🧱 Mock the custom hook (no need to call API)
jest.mock("@/hooks/useCategories", () => ({
  default: () => ({
    categories: [
      {
        id: 1,
        name: "Math",
        group: 10,
        subject: "Rekenen",
        subcategories: [
          { id: 11, name: "Addition" },
          { id: 12, name: "Subtraction" },
        ],
      },
      {
        id: 2,
        name: "Reading",
        group: 10,
        subject: "Begrijpend Lezen",
        subcategories: [],
      },
    ],
  }),
}));

// 🧱 Mock API call
jest.mock("@/config/axios", () => ({
  AxiosPublic: {
    post: jest.fn(() =>
      Promise.resolve({
        data: {
          question: [{ id: 1, question: "2 + 2 = ?" }],
          session_id: "abc123",
        },
      })
    ),
  },
}));

const queryClient = new QueryClient();

function renderCategoryPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CategoryPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("CategoryPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders category list", async () => {
    renderCategoryPage();
    expect(await screen.findByText("Math")).toBeInTheDocument();
    expect(screen.getByText("Reading")).toBeInTheDocument();
  });

  test("selects and deselects a category", async () => {
    renderCategoryPage();

    const selectButton = await screen.findByRole("button", { name: /select/i });
    fireEvent.click(selectButton);

    expect(selectButton).toHaveTextContent("Deselect");
  });

  test("enables Start Now button when category selected", async () => {
    renderCategoryPage();

    const startButton = screen.getByRole("button", { name: /start now/i });
    expect(startButton).toBeDisabled();

    const selectButton = await screen.findByRole("button", { name: /select/i });
    fireEvent.click(selectButton);

    expect(startButton).not.toBeDisabled();
  });

  test("opens difficulty dialog and starts quiz", async () => {
    renderCategoryPage();

    const selectButton = await screen.findByRole("button", { name: /select/i });
    fireEvent.click(selectButton);

    const startButton = screen.getByRole("button", { name: /start now/i });
    fireEvent.click(startButton);

    expect(
      await screen.findByText("Select Difficulty Level")
    ).toBeInTheDocument();

    const easyButton = screen.getByRole("button", { name: /easy/i });
    fireEvent.click(easyButton);

    const startQuizButton = screen.getByRole("button", { name: /start quiz/i });
    fireEvent.click(startQuizButton);

    await waitFor(() => {
      expect(localStorage.getItem("sessionId")).toBe("abc123");
    });
  });
});
