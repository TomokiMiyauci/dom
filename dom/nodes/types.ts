import { type Node } from "./node.ts";
import type { ChildNode } from "./node_trees/child_node.ts";
import type { ParentNode } from "./node_trees/parent_node.ts";

export type Child = Node & ChildNode;
export type Parent = Node & ParentNode;
