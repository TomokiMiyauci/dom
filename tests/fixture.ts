import { Document } from "../mod.ts";

const document = new Document();

/**
 *                 ______________A______________
 *                /                             \
 *         ______B______                   _____J______
 *        /             \                 /            \
 *     __C__           __F__             K              L
 *    /     \         /  |  \
 *   D       E       G   H   I
 */
export const A = document.createElement("A");
export const B = document.createElement("B");
export const C = document.createElement("C");
export const D = document.createElement("D");
export const E = document.createElement("E");
export const F = document.createElement("F");
export const G = document.createElement("G");
export const H = document.createElement("H");
export const I = document.createElement("I");
export const J = document.createElement("J");
export const K = document.createElement("K");
export const L = document.createElement("L");

A.append(B, J);
B.append(C, F);
C.append(D, E);
F.append(G, H, I);
J.append(K, L);
