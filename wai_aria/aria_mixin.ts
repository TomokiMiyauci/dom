import { type Constructor } from "../deps.ts";
import type { IARIAMixin } from "../interface.d.ts";

export function ARIAMixin<T extends Constructor>(Ctor: T) {
  return class extends Ctor implements IARIAMixin {
    get ariaAtomic(): string | null {
      throw new Error();
    }
    get ariaAutoComplete(): string | null {
      throw new Error();
    }
    get ariaBusy(): string | null {
      throw new Error();
    }
    get ariaChecked(): string | null {
      throw new Error();
    }
    get ariaColCount(): string | null {
      throw new Error();
    }
    get ariaColIndex(): string | null {
      throw new Error();
    }
    get ariaColSpan(): string | null {
      throw new Error();
    }
    get ariaCurrent(): string | null {
      throw new Error();
    }
    get ariaDisabled(): string | null {
      throw new Error();
    }
    get ariaExpanded(): string | null {
      throw new Error();
    }
    get ariaHasPopup(): string | null {
      throw new Error();
    }
    get ariaHidden(): string | null {
      throw new Error();
    }
    get ariaInvalid(): string | null {
      throw new Error();
    }
    get ariaKeyShortcuts(): string | null {
      throw new Error();
    }
    get ariaLabel(): string | null {
      throw new Error();
    }
    get ariaLevel(): string | null {
      throw new Error();
    }
    get ariaLive(): string | null {
      throw new Error();
    }
    get ariaModal(): string | null {
      throw new Error();
    }
    get ariaMultiLine(): string | null {
      throw new Error();
    }
    get ariaMultiSelectable(): string | null {
      throw new Error();
    }
    get ariaOrientation(): string | null {
      throw new Error();
    }
    get ariaPlaceholder(): string | null {
      throw new Error();
    }
    get ariaPosInSet(): string | null {
      throw new Error();
    }
    get ariaPressed(): string | null {
      throw new Error();
    }
    get ariaReadOnly(): string | null {
      throw new Error();
    }
    get ariaRequired(): string | null {
      throw new Error();
    }
    get ariaRoleDescription(): string | null {
      throw new Error();
    }
    get ariaRowCount(): string | null {
      throw new Error();
    }
    get ariaRowIndex(): string | null {
      throw new Error();
    }
    get ariaRowSpan(): string | null {
      throw new Error();
    }
    get ariaSelected(): string | null {
      throw new Error();
    }
    get ariaSetSize(): string | null {
      throw new Error();
    }
    get ariaSort(): string | null {
      throw new Error();
    }
    get ariaValueMax(): string | null {
      throw new Error();
    }
    get ariaValueMin(): string | null {
      throw new Error();
    }
    get ariaValueNow(): string | null {
      throw new Error();
    }
    get ariaValueText(): string | null {
      throw new Error();
    }
    get role(): string | null {
      throw new Error();
    }

    set ariaAtomic(value: string | null) {
      throw new Error();
    }
    set ariaAutoComplete(value: string | null) {
      throw new Error();
    }
    set ariaBusy(value: string | null) {
      throw new Error();
    }
    set ariaChecked(value: string | null) {
      throw new Error();
    }
    set ariaColCount(value: string | null) {
      throw new Error();
    }
    set ariaColIndex(value: string | null) {
      throw new Error();
    }
    set ariaColSpan(value: string | null) {
      throw new Error();
    }
    set ariaCurrent(value: string | null) {
      throw new Error();
    }
    set ariaDisabled(value: string | null) {
      throw new Error();
    }
    set ariaExpanded(value: string | null) {
      throw new Error();
    }
    set ariaHasPopup(value: string | null) {
      throw new Error();
    }
    set ariaHidden(value: string | null) {
      throw new Error();
    }
    set ariaInvalid(value: string | null) {
      throw new Error();
    }
    set ariaKeyShortcuts(value: string | null) {
      throw new Error();
    }
    set ariaLabel(value: string | null) {
      throw new Error();
    }
    set ariaLevel(value: string | null) {
      throw new Error();
    }
    set ariaLive(value: string | null) {
      throw new Error();
    }
    set ariaModal(value: string | null) {
      throw new Error();
    }
    set ariaMultiLine(value: string | null) {
      throw new Error();
    }
    set ariaMultiSelectable(value: string | null) {
      throw new Error();
    }
    set ariaOrientation(value: string | null) {
      throw new Error();
    }
    set ariaPlaceholder(value: string | null) {
      throw new Error();
    }
    set ariaPosInSet(value: string | null) {
      throw new Error();
    }
    set ariaPressed(value: string | null) {
      throw new Error();
    }
    set ariaReadOnly(value: string | null) {
      throw new Error();
    }
    set ariaRequired(value: string | null) {
      throw new Error();
    }
    set ariaRoleDescription(value: string | null) {
      throw new Error();
    }
    set ariaRowCount(value: string | null) {
      throw new Error();
    }
    set ariaRowIndex(value: string | null) {
      throw new Error();
    }
    set ariaRowSpan(value: string | null) {
      throw new Error();
    }
    set ariaSelected(value: string | null) {
      throw new Error();
    }
    set ariaSetSize(value: string | null) {
      throw new Error();
    }
    set ariaSort(value: string | null) {
      throw new Error();
    }
    set ariaValueMax(value: string | null) {
      throw new Error();
    }
    set ariaValueMin(value: string | null) {
      throw new Error();
    }
    set ariaValueNow(value: string | null) {
      throw new Error();
    }
    set ariaValueText(value: string | null) {
      throw new Error();
    }
    set role(value: string | null) {
      throw new Error();
    }
  };
}

// deno-lint-ignore no-empty-interface
export interface ARIAMixin extends IARIAMixin {}
