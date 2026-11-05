import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Form from "@/app/auth/login/components/Form";

const replace = vi.fn();
vi.mock("next-view-transitions", () => ({
  useTransitionRouter: () => ({ push: replace }),
}));

describe("login form", () => {
  beforeEach(() => {
    replace.mockClear();
    document.cookie = "";
    vi.unstubAllGlobals();
    document.cookie = "key=; Max-Age=0; path=/";
  });

  it("recovers from a malformed login response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not JSON")));
    render(<Form />);
    await userEvent.type(
      screen.getByLabelText(/registration number/i),
      "RA2211003010001"
    );
    await userEvent.type(screen.getByLabelText(/^password$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /^login$/i }));
    expect(await screen.findByText(/unable to reach/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^login$/i })).toBeEnabled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("shows a service failure without navigating", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<Form />);
    await userEvent.type(
      screen.getByLabelText(/registration number/i),
      "RA2211003010001"
    );
    await userEvent.type(screen.getByLabelText(/^password$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/unable to reach/i)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("stores the session cookie only after a valid response", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({ authenticated: true, cookies: "session=value" }),
            { status: 200 }
          )
        )
    );
    render(<Form />);
    await userEvent.type(
      screen.getByLabelText(/registration number/i),
      "RA2211003010001"
    );
    await userEvent.type(screen.getByLabelText(/^password$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/academia"));
    expect(document.cookie).toContain("key=session%3Dvalue");
  });
});
