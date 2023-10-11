import type { IAnimatable } from "../interface.d.ts";

export class Animatable implements IAnimatable {
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
