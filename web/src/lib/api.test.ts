import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchJSON } from "./api";

describe("fetchJSON", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, "window");
  });

  it("does not surface raw response bodies with paths, tokens, or stack traces in thrown errors", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: async () => "Traceback raw /Users/lidises/nas token=secret sk-office-sentinel",
    } as Response);

    await expect(fetchJSON("/api/office/state")).rejects.toThrow("500: request failed");
    await expect(fetchJSON("/api/office/state")).rejects.not.toThrow(/Traceback|\/Users\/lidises|token=secret|sk-office/i);
    expect(fetchMock).toHaveBeenCalledWith("/api/office/state", expect.objectContaining({ headers: expect.any(Headers) }));
  });

  it("turns rejected network failures into a constant safe error", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("ECONNRESET raw /home/hermes/.env token=secret"));

    await expect(fetchJSON("/api/office/events")).rejects.toThrow("Network request failed");
    await expect(fetchJSON("/api/office/events")).rejects.not.toThrow(/\/home\/hermes|token=secret|ECONNRESET/i);
  });
});
