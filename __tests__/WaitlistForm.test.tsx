import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WaitlistForm from "@/components/WaitlistForm";

// Mock AnalyticsTracker so it doesn't error in jsdom
vi.mock("@/components/AnalyticsTracker", () => ({
  trackEvent: vi.fn(),
}));

function setup() {
  const user = userEvent.setup();
  render(<WaitlistForm />);
  return { user };
}

function getForm() {
  return {
    name: () => screen.getByPlaceholderText("Mohan"),
    whatsapp: () => screen.getByPlaceholderText("9876543210"),
    // two comboboxes: [0] = country code, [1] = occupation
    countryCode: () => screen.getAllByRole("combobox")[0],
    occupation: () => screen.getAllByRole("combobox")[1],
    submit: () => screen.getByRole("button", { name: /join waitlist/i }),
  };
}

// ─── Render ─────────────────────────────────────────────────────────────────

describe("WaitlistForm — render", () => {
  it("shows all fields and submit button", () => {
    setup();
    const f = getForm();
    expect(f.name()).toBeInTheDocument();
    expect(f.whatsapp()).toBeInTheDocument();
    expect(f.occupation()).toBeInTheDocument();
    expect(f.submit()).toBeInTheDocument();
  });

  it("occupation field is optional (no required indicator in label)", () => {
    setup();
    expect(screen.getByText(/optional/i)).toBeInTheDocument();
  });
});

// ─── Validation ─────────────────────────────────────────────────────────────

describe("WaitlistForm — validation", () => {
  it("shows error when name is empty on submit", async () => {
    const { user } = setup();
    await user.click(getForm().submit());
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  it("shows error when name is only 1 character", async () => {
    const { user } = setup();
    await user.type(getForm().name(), "A");
    await user.click(getForm().submit());
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  it("shows error when WhatsApp number is empty on submit", async () => {
    const { user } = setup();
    await user.type(getForm().name(), "Mohan");
    await user.click(getForm().submit());
    expect(
      await screen.findByText(/enter a valid whatsapp number/i)
    ).toBeInTheDocument();
  });

  it("shows error for a number shorter than 10 digits", async () => {
    const { user } = setup();
    await user.type(getForm().name(), "Mohan");
    await user.type(getForm().whatsapp(), "12345");
    await user.click(getForm().submit());
    expect(
      await screen.findByText(/enter a valid whatsapp number/i)
    ).toBeInTheDocument();
  });

  it("accepts a valid 10-digit number", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
    );
    const { user } = setup();
    await user.type(getForm().name(), "Mohan");
    await user.type(getForm().whatsapp(), "9876543210");
    await user.click(getForm().submit());
    await waitFor(() => {
      expect(
        screen.queryByText(/enter a valid whatsapp number/i)
      ).not.toBeInTheDocument();
    });
    vi.unstubAllGlobals();
  });

  it("defaults country code to +91", () => {
    setup();
    expect(getForm().countryCode()).toHaveValue("+91");
  });

  it("allows switching to a different country code", async () => {
    const { user } = setup();
    await user.selectOptions(getForm().countryCode(), "+44");
    expect(getForm().countryCode()).toHaveValue("+44");
  });

  it("rejects a number with letters or symbols", async () => {
    const { user } = setup();
    await user.type(getForm().name(), "Mohan");
    await user.type(getForm().whatsapp(), "98abc65210");
    await user.click(getForm().submit());
    expect(
      await screen.findByText(/digits only/i)
    ).toBeInTheDocument();
  });

  it("does not validate occupation (it is optional)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
    );
    const { user } = setup();
    await user.type(getForm().name(), "Mohan");
    await user.type(getForm().whatsapp(), "9876543210");
    // leave occupation unselected
    await user.click(getForm().submit());
    await waitFor(() => {
      expect(
        screen.queryByText(/occupation.*required/i)
      ).not.toBeInTheDocument();
    });
    vi.unstubAllGlobals();
  });
});

// ─── Submission ──────────────────────────────────────────────────────────────

describe("WaitlistForm — submission", () => {
  beforeEach(() => vi.restoreAllMocks());

  async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
    const f = getForm();
    await user.type(f.name(), "Mohan");
    await user.type(f.whatsapp(), "9876543210");
    await user.click(f.submit());
  }

  it("shows loading spinner while submitting", async () => {
    let resolve: (v: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((r) => {
            resolve = r;
          })
      )
    );
    const { user } = setup();
    // don't await — keep the promise pending
    fillAndSubmit(user);
    expect(await screen.findByText(/joining/i)).toBeInTheDocument();
    // clean up: resolve so the component settles
    resolve!({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.unstubAllGlobals();
  });

  it("shows success state after submission", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
    );
    const { user } = setup();
    await fillAndSubmit(user);
    expect(
      await screen.findByText(/you're on the waitlist/i)
    ).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("posts name, mobileNumber, and occupation to /api/waitlist", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal("fetch", fetchMock);

    const { user } = setup();
    const f = getForm();
    await user.type(f.name(), "Mohan");
    await user.type(f.whatsapp(), "9876543210");
    await user.selectOptions(f.occupation(), "Salaried");
    await user.click(f.submit());

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/waitlist");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      name: "Mohan",
      mobileNumber: "+919876543210",  // countryCode (+91) prepended to digits
      occupation: "Salaried",
    });
    vi.unstubAllGlobals();
  });

  it("shows API error message when server returns an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "This number is already on the waitlist." }),
      })
    );
    const { user } = setup();
    await fillAndSubmit(user);
    expect(
      await screen.findByText(/already on the waitlist/i)
    ).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("shows generic error when network fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );
    const { user } = setup();
    await fillAndSubmit(user);
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("shows error when rate limited (429)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Too many requests. Please try again later." }),
      })
    );
    const { user } = setup();
    await fillAndSubmit(user);
    expect(await screen.findByText(/too many requests/i)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("disables inputs and submit button while submitting", async () => {
    let resolve: (v: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((r) => {
            resolve = r;
          })
      )
    );
    const { user } = setup();
    fillAndSubmit(user);
    await screen.findByText(/joining/i);
    expect(getForm().name()).toBeDisabled();
    expect(getForm().whatsapp()).toBeDisabled();
    // button text has changed to "Joining…" — query by role, not label
    expect(screen.getByRole("button")).toBeDisabled();
    resolve!({ ok: true, json: async () => ({ success: true }) });
    vi.unstubAllGlobals();
  });
});
