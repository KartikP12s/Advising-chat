import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingPreview } from "@/components/landing-preview";

describe("LandingPreview", () => {
  it("lets a user privately mark a helpful moment", () => {
    render(<LandingPreview />);
    const button = screen.getByRole("button", { name: "This helped" });
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Marked helpful" })).toHaveAttribute("aria-pressed", "true");
  });
});
