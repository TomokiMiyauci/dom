import { type Node } from "./node.ts";
import type { ChildNode } from "./child_node.ts";
import type { ParentNode } from "./parent_node.ts";

export type Child = Node & ChildNode;
export type Parent = Node & ParentNode;
