import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import Scaffold from "./Scaffold";

vi.spyOn(Math, "random").mockReturnValue(1); // prevent random ids regenerating

describe("Scaffold snapshot", () => {
  it("matches snapshot", () => {
    const { container } = render(
      <MantineProvider>
        <MemoryRouter>
          <Scaffold>
            <p>test</p>
          </Scaffold>
        </MemoryRouter>
      </MantineProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
