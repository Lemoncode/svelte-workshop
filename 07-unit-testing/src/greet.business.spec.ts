import { greetSomebody } from "./greet.business";

describe("greet business", () => {
  it("should greet somebody", () => {
    expect(greetSomebody("John")).toBe("Hello John!");
  });
});
