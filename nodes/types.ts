import { type Node } from "./node.ts";
import type { ChildNode } from "./child_node.ts";

export type Child = (Node & ChildNode) | null;
