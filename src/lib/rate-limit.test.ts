import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("limitador de peticiones", () => {
  it("bloquea al superar el límite y libera al expirar la ventana", () => {
    let clock = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => clock });
    expect(limiter.hit("ip").allowed).toBe(true);
    expect(limiter.hit("ip").allowed).toBe(true);
    const blocked = limiter.hit("ip");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(1);
    clock = 1000;
    expect(limiter.hit("ip").allowed).toBe(true);
  });

  it("cuenta cada clave por separado", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    expect(limiter.hit("a").allowed).toBe(true);
    expect(limiter.hit("b").allowed).toBe(true);
  });
});
