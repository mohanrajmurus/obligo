import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted to the top of the file by Vitest, so the factory must not
// reference variables declared below. Use vi.hoisted() to declare mocks first.
const {
  mockFindOne,
  mockCreate,
  mockCountDocuments,
  mockDropIndex,
  mockCheckRateLimit,
} = vi.hoisted(() => ({
  mockFindOne: vi.fn(),
  mockCreate: vi.fn(),
  mockCountDocuments: vi.fn(),
  mockDropIndex: vi.fn().mockResolvedValue(undefined),
  mockCheckRateLimit: vi.fn().mockReturnValue(true),
}));

vi.mock("@/lib/mongodb", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/models/Waitlist", () => ({
  default: {
    findOne: mockFindOne,
    create: mockCreate,
    countDocuments: mockCountDocuments,
    collection: { dropIndex: mockDropIndex },
  },
}));

vi.mock("@/lib/rateLimiter", () => ({
  checkRateLimit: mockCheckRateLimit,
}));

import { GET, POST } from "@/app/api/waitlist/route";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "1.2.3.4",
    },
    body: JSON.stringify(body),
  });
}

// ─── GET ─────────────────────────────────────────────────────────────────────

describe("GET /api/waitlist", () => {
  it("returns the current waitlist count", async () => {
    mockCountDocuments.mockResolvedValueOnce(42);
    const res = await GET();
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.count).toBe(42);
  });

  it("returns count 0 with 500 status when DB throws", async () => {
    mockCountDocuments.mockRejectedValueOnce(new Error("DB error"));
    const res = await GET();
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.count).toBe(0);
  });
});

// ─── POST ────────────────────────────────────────────────────────────────────

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckRateLimit.mockReturnValue(true);
    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      _id: "abc123",
      name: "Mohan",
      mobileNumber: "9876543210",
    });
    mockDropIndex.mockResolvedValue(undefined);
  });

  // ─── Happy path ──────────────────────────────────────────────────────────

  it("creates entry and returns 201 for valid data", async () => {
    const res = await POST(
      makeRequest({ name: "Mohan", mobileNumber: "9876543210" })
    );
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
  });

  it("saves occupation when provided", async () => {
    await POST(
      makeRequest({
        name: "Mohan",
        mobileNumber: "9876543210",
        occupation: "Salaried",
      })
    );
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ occupation: "Salaried" })
    );
  });

  it("saves entry without occupation when omitted", async () => {
    await POST(makeRequest({ name: "Mohan", mobileNumber: "9876543210" }));
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.occupation).toBeUndefined();
  });

  // ─── Validation ──────────────────────────────────────────────────────────

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ mobileNumber: "9876543210" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/name/i);
  });

  it("returns 400 when mobileNumber is missing", async () => {
    const res = await POST(makeRequest({ name: "Mohan" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/whatsapp/i);
  });

  it("returns 400 when both name and mobileNumber are missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  // ─── Conflict / duplicate ────────────────────────────────────────────────

  it("returns 409 when number is already registered", async () => {
    mockFindOne.mockResolvedValueOnce({ mobileNumber: "9876543210" });
    const res = await POST(
      makeRequest({ name: "Mohan", mobileNumber: "9876543210" })
    );
    const body = await res.json();
    expect(res.status).toBe(409);
    expect(body.error).toMatch(/already on the waitlist/i);
  });

  it("does not call create when duplicate is found", async () => {
    mockFindOne.mockResolvedValueOnce({ mobileNumber: "9876543210" });
    await POST(makeRequest({ name: "Mohan", mobileNumber: "9876543210" }));
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ─── Rate limiting ────────────────────────────────────────────────────────

  it("returns 429 when rate limit is exceeded", async () => {
    mockCheckRateLimit.mockReturnValueOnce(false);
    const res = await POST(
      makeRequest({ name: "Mohan", mobileNumber: "9876543210" })
    );
    expect(res.status).toBe(429);
    expect((await res.json()).error).toMatch(/too many requests/i);
  });

  it("does not touch the DB when rate limited", async () => {
    mockCheckRateLimit.mockReturnValueOnce(false);
    await POST(makeRequest({ name: "Mohan", mobileNumber: "9876543210" }));
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ─── Server error ─────────────────────────────────────────────────────────

  it("returns 500 when DB throws unexpectedly", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Mongo crashed"));
    const res = await POST(
      makeRequest({ name: "Mohan", mobileNumber: "9876543210" })
    );
    expect(res.status).toBe(500);
  });

  // ─── Index migration ──────────────────────────────────────────────────────

  it("attempts to drop the stale email_1 index on every POST", async () => {
    await POST(makeRequest({ name: "Mohan", mobileNumber: "9876543210" }));
    expect(mockDropIndex).toHaveBeenCalledWith("email_1");
  });

  it("does not fail when email_1 index no longer exists", async () => {
    mockDropIndex.mockRejectedValueOnce(new Error("index not found"));
    const res = await POST(
      makeRequest({ name: "Mohan", mobileNumber: "9876543210" })
    );
    expect(res.status).toBe(201);
  });
});
