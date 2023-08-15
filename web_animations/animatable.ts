import { type Constructor } from "../deps.ts";
import type { IAnimatable } from "../interface.d.ts";

export function Animatable<T extends Constructor>(Ctor: T) {
  abstract class Animatable extends Ctor implements IAnimatable {
    animate(
      keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
      options?: number | KeyframeAnimationOptions,
    ): Animation {
      throw new Error();
    }

    getAnimations(options?: GetAnimationsOptions): Animation[] {
      throw new Error();
    }
  }

  return Animatable;
}

// deno-lint-ignore no-empty-interface
export interface Animatable extends IAnimatable {}
