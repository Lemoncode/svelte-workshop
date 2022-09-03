import { render, screen } from "@testing-library/svelte";
import Greet from "./greet.svelte";

describe("greet component", () => {
  it("should render", () => {
    render(Greet, { name: "John" });

    const heading = screen.getByText("Hello John !");

    expect(heading).toBeInTheDocument();
  });
});
