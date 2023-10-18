import { Position, position } from "./boundary_point.ts";
import { assertEquals, describe, it } from "../_dev_deps.ts";
import { A, B } from "../tests/fixture.ts";
import type { BoundaryPoint } from "../i.ts";

describe("position", () => {
  it("should return position", () => {
    const table: [BoundaryPoint, BoundaryPoint, Position][] = [
      [[A, 0], [A, 0], Position.Equal],
      [[A, 0], [A, 1], Position.Before],
      [[A, 1], [A, 0], Position.After],
      [[A, 0], [B, 0], Position.Before],
      [[A, 0], [B, 1], Position.Before],
      [[A, 1], [B, 0], Position.After],
      [[B, 0], [A, 0], Position.After],
      [[B, 1], [A, 0], Position.After],
      [[B, 0], [A, 1], Position.Before],
    ];

    table.forEach(([a, b, expected]) => {
      assertEquals(position(a, b), expected);
    });
  });
});
