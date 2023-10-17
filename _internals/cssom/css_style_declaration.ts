import type { ICSSStyleDeclaration } from "../interface.d.ts";
import { setAttributeValue } from "../../nodes/utils/set_attribute_value.ts";
import { $Element } from "../../i.ts";

export class CSSStyleDeclaration implements ICSSStyleDeclaration {
  #ownerNode: $Element;
  constructor({ ownerNode }: { ownerNode: $Element }) {
    this.#ownerNode = ownerNode;
  }

  [index: number]: string;
  get accentColor(): string {
    throw new Error("accentColor#getter");
  }
  set accentColor(value: string) {
    throw new Error("accentColor#setter");
  }

  get alignContent(): string {
    throw new Error("alignContent#getter");
  }
  set alignContent(value: string) {
    throw new Error("alignContent#setter");
  }

  get alignItems(): string {
    throw new Error("alignItems#getter");
  }
  set alignItems(value: string) {
    throw new Error("alignItems#setter");
  }

  get alignSelf(): string {
    throw new Error("alignSelf#getter");
  }
  set alignSelf(value: string) {
    throw new Error("alignSelf#setter");
  }
  get alignmentBaseline(): string {
    throw new Error("alignmentBaseline#getter");
  }
  set alignmentBaseline(value: string) {
    throw new Error("alignmentBaseline#setter");
  }

  get all(): string {
    throw new Error("all#getter");
  }
  set all(value: string) {
    throw new Error("all#setter");
  }

  get animation(): string {
    throw new Error("animation#getter");
  }
  set animation(value: string) {
    throw new Error("animation#setter");
  }

  get animationComposition(): string {
    throw new Error("animationComposition#getter");
  }
  set animationComposition(value: string) {
    throw new Error("animationComposition#setter");
  }

  get animationDelay(): string {
    throw new Error("animationDelay#getter");
  }
  set animationDelay(value: string) {
    throw new Error("animationDelay#setter");
  }

  get animationDirection(): string {
    throw new Error("animationDirection#getter");
  }
  set animationDirection(value: string) {
    throw new Error("animationDirection#setter");
  }

  get animationDuration(): string {
    throw new Error("animationDuration#getter");
  }
  set animationDuration(value: string) {
    throw new Error("animationDuration#setter");
  }

  get animationFillMode(): string {
    throw new Error("animationFillMode#getter");
  }
  set animationFillMode(value: string) {
    throw new Error("animationFillMode#setter");
  }

  get animationIterationCount(): string {
    throw new Error("animationIterationCount#getter");
  }
  set animationIterationCount(value: string) {
    throw new Error("animationIterationCount#setter");
  }

  get animationName(): string {
    throw new Error("animationName#getter");
  }
  set animationName(value: string) {
    throw new Error("animationName#setter");
  }

  get animationPlayState(): string {
    throw new Error("animationPlayState#getter");
  }
  set animationPlayState(value: string) {
    throw new Error("animationPlayState#setter");
  }

  get animationTimingFunction(): string {
    throw new Error("animationTimingFunction#getter");
  }
  set animationTimingFunction(value: string) {
    throw new Error("animationTimingFunction#setter");
  }

  get appearance(): string {
    throw new Error("appearance#getter");
  }
  set appearance(value: string) {
    throw new Error("appearance#setter");
  }

  get aspectRatio(): string {
    throw new Error("aspectRatio#getter");
  }
  set aspectRatio(value: string) {
    throw new Error("aspectRatio#setter");
  }

  get backdropFilter(): string {
    throw new Error("backdropFilter#getter");
  }
  set backdropFilter(value: string) {
    throw new Error("backdropFilter#setter");
  }

  get backfaceVisibility(): string {
    throw new Error("backfaceVisibility#getter");
  }
  set backfaceVisibility(value: string) {
    throw new Error("backfaceVisibility#setter");
  }

  get background(): string {
    throw new Error("background#getter");
  }
  set background(value: string) {
    throw new Error("background#setter");
  }

  get backgroundAttachment(): string {
    throw new Error("backgroundAttachment#getter");
  }
  set backgroundAttachment(value: string) {
    throw new Error("backgroundAttachment#setter");
  }

  get backgroundBlendMode(): string {
    throw new Error("backgroundBlendMode#getter");
  }
  set backgroundBlendMode(value: string) {
    throw new Error("backgroundBlendMode#setter");
  }

  get backgroundClip(): string {
    throw new Error("backgroundClip#getter");
  }
  set backgroundClip(value: string) {
    throw new Error("backgroundClip#setter");
  }

  get backgroundColor(): string {
    throw new Error("backgroundColor#getter");
  }
  set backgroundColor(value: string) {
    throw new Error("backgroundColor#setter");
  }

  get backgroundImage(): string {
    throw new Error("backgroundImage#getter");
  }
  set backgroundImage(value: string) {
    throw new Error("backgroundImage#setter");
  }

  get backgroundOrigin(): string {
    throw new Error("backgroundOrigin#getter");
  }
  set backgroundOrigin(value: string) {
    throw new Error("backgroundOrigin#setter");
  }

  get backgroundPosition(): string {
    throw new Error("backgroundPosition#getter");
  }
  set backgroundPosition(value: string) {
    throw new Error("backgroundPosition#setter");
  }

  get backgroundPositionX(): string {
    throw new Error("backgroundPositionX#getter");
  }
  set backgroundPositionX(value: string) {
    throw new Error("backgroundPositionX#setter");
  }

  get backgroundPositionY(): string {
    throw new Error("backgroundPositionY#getter");
  }
  set backgroundPositionY(value: string) {
    throw new Error("backgroundPositionY#setter");
  }

  get backgroundRepeat(): string {
    throw new Error("backgroundRepeat#getter");
  }
  set backgroundRepeat(value: string) {
    throw new Error("backgroundRepeat#setter");
  }

  get backgroundSize(): string {
    throw new Error("backgroundSize#getter");
  }
  set backgroundSize(value: string) {
    throw new Error("backgroundSize#setter");
  }
  get baselineShift(): string {
    throw new Error("baselineShift#getter");
  }
  set baselineShift(value: string) {
    throw new Error("baselineShift#setter");
  }

  get blockSize(): string {
    throw new Error("blockSize#getter");
  }
  set blockSize(value: string) {
    throw new Error("blockSize#setter");
  }

  get border(): string {
    throw new Error("border#getter");
  }
  set border(value: string) {
    throw new Error("border#setter");
  }

  get borderBlock(): string {
    throw new Error("borderBlock#getter");
  }
  set borderBlock(value: string) {
    throw new Error("borderBlock#setter");
  }

  get borderBlockColor(): string {
    throw new Error("borderBlockColor#getter");
  }
  set borderBlockColor(value: string) {
    throw new Error("borderBlockColor#setter");
  }

  get borderBlockEnd(): string {
    throw new Error("borderBlockEnd#getter");
  }
  set borderBlockEnd(value: string) {
    throw new Error("borderBlockEnd#setter");
  }

  get borderBlockEndColor(): string {
    throw new Error("borderBlockEndColor#getter");
  }
  set borderBlockEndColor(value: string) {
    throw new Error("borderBlockEndColor#setter");
  }

  get borderBlockEndStyle(): string {
    throw new Error("borderBlockEndStyle#getter");
  }
  set borderBlockEndStyle(value: string) {
    throw new Error("borderBlockEndStyle#setter");
  }

  get borderBlockEndWidth(): string {
    throw new Error("borderBlockEndWidth#getter");
  }
  set borderBlockEndWidth(value: string) {
    throw new Error("borderBlockEndWidth#setter");
  }

  get borderBlockStart(): string {
    throw new Error("borderBlockStart#getter");
  }
  set borderBlockStart(value: string) {
    throw new Error("borderBlockStart#setter");
  }

  get borderBlockStartColor(): string {
    throw new Error("borderBlockStartColor#getter");
  }
  set borderBlockStartColor(value: string) {
    throw new Error("borderBlockStartColor#setter");
  }

  get borderBlockStartStyle(): string {
    throw new Error("borderBlockStartStyle#getter");
  }
  set borderBlockStartStyle(value: string) {
    throw new Error("borderBlockStartStyle#setter");
  }

  get borderBlockStartWidth(): string {
    throw new Error("borderBlockStartWidth#getter");
  }
  set borderBlockStartWidth(value: string) {
    throw new Error("borderBlockStartWidth#setter");
  }

  get borderBlockStyle(): string {
    throw new Error("borderBlockStyle#getter");
  }
  set borderBlockStyle(value: string) {
    throw new Error("borderBlockStyle#setter");
  }

  get borderBlockWidth(): string {
    throw new Error("borderBlockWidth#getter");
  }
  set borderBlockWidth(value: string) {
    throw new Error("borderBlockWidth#setter");
  }

  get borderBottom(): string {
    throw new Error("borderBottom#getter");
  }
  set borderBottom(value: string) {
    throw new Error("borderBottom#setter");
  }

  get borderBottomColor(): string {
    throw new Error("borderBottomColor#getter");
  }
  set borderBottomColor(value: string) {
    throw new Error("borderBottomColor#setter");
  }

  get borderBottomLeftRadius(): string {
    throw new Error("borderBottomLeftRadius#getter");
  }
  set borderBottomLeftRadius(value: string) {
    throw new Error("borderBottomLeftRadius#setter");
  }

  get borderBottomRightRadius(): string {
    throw new Error("borderBottomRightRadius#getter");
  }
  set borderBottomRightRadius(value: string) {
    throw new Error("borderBottomRightRadius#setter");
  }

  get borderBottomStyle(): string {
    throw new Error("borderBottomStyle#getter");
  }
  set borderBottomStyle(value: string) {
    throw new Error("borderBottomStyle#setter");
  }

  get borderBottomWidth(): string {
    throw new Error("borderBottomWidth#getter");
  }
  set borderBottomWidth(value: string) {
    throw new Error("borderBottomWidth#setter");
  }

  get borderCollapse(): string {
    throw new Error("borderCollapse#getter");
  }
  set borderCollapse(value: string) {
    throw new Error("borderCollapse#setter");
  }

  get borderColor(): string {
    throw new Error("borderColor#getter");
  }
  set borderColor(value: string) {
    throw new Error("borderColor#setter");
  }

  get borderEndEndRadius(): string {
    throw new Error("borderEndEndRadius#getter");
  }
  set borderEndEndRadius(value: string) {
    throw new Error("borderEndEndRadius#setter");
  }

  get borderEndStartRadius(): string {
    throw new Error("borderEndStartRadius#getter");
  }
  set borderEndStartRadius(value: string) {
    throw new Error("borderEndStartRadius#setter");
  }

  get borderImage(): string {
    throw new Error("borderImage#getter");
  }
  set borderImage(value: string) {
    throw new Error("borderImage#setter");
  }

  get borderImageOutset(): string {
    throw new Error("borderImageOutset#getter");
  }
  set borderImageOutset(value: string) {
    throw new Error("borderImageOutset#setter");
  }

  get borderImageRepeat(): string {
    throw new Error("borderImageRepeat#getter");
  }
  set borderImageRepeat(value: string) {
    throw new Error("borderImageRepeat#setter");
  }

  get borderImageSlice(): string {
    throw new Error("borderImageSlice#getter");
  }
  set borderImageSlice(value: string) {
    throw new Error("borderImageSlice#setter");
  }

  get borderImageSource(): string {
    throw new Error("borderImageSource#getter");
  }
  set borderImageSource(value: string) {
    throw new Error("borderImageSource#setter");
  }

  get borderImageWidth(): string {
    throw new Error("borderImageWidth#getter");
  }
  set borderImageWidth(value: string) {
    throw new Error("borderImageWidth#setter");
  }

  get borderInline(): string {
    throw new Error("borderInline#getter");
  }
  set borderInline(value: string) {
    throw new Error("borderInline#setter");
  }

  get borderInlineColor(): string {
    throw new Error("borderInlineColor#getter");
  }
  set borderInlineColor(value: string) {
    throw new Error("borderInlineColor#setter");
  }

  get borderInlineEnd(): string {
    throw new Error("borderInlineEnd#getter");
  }
  set borderInlineEnd(value: string) {
    throw new Error("borderInlineEnd#setter");
  }

  get borderInlineEndColor(): string {
    throw new Error("borderInlineEndColor#getter");
  }
  set borderInlineEndColor(value: string) {
    throw new Error("borderInlineEndColor#setter");
  }

  get borderInlineEndStyle(): string {
    throw new Error("borderInlineEndStyle#getter");
  }
  set borderInlineEndStyle(value: string) {
    throw new Error("borderInlineEndStyle#setter");
  }

  get borderInlineEndWidth(): string {
    throw new Error("borderInlineEndWidth#getter");
  }
  set borderInlineEndWidth(value: string) {
    throw new Error("borderInlineEndWidth#setter");
  }

  get borderInlineStart(): string {
    throw new Error("borderInlineStart#getter");
  }
  set borderInlineStart(value: string) {
    throw new Error("borderInlineStart#setter");
  }

  get borderInlineStartColor(): string {
    throw new Error("borderInlineStartColor#getter");
  }
  set borderInlineStartColor(value: string) {
    throw new Error("borderInlineStartColor#setter");
  }

  get borderInlineStartStyle(): string {
    throw new Error("borderInlineStartStyle#getter");
  }
  set borderInlineStartStyle(value: string) {
    throw new Error("borderInlineStartStyle#setter");
  }

  get borderInlineStartWidth(): string {
    throw new Error("borderInlineStartWidth#getter");
  }
  set borderInlineStartWidth(value: string) {
    throw new Error("borderInlineStartWidth#setter");
  }

  get borderInlineStyle(): string {
    throw new Error("borderInlineStyle#getter");
  }
  set borderInlineStyle(value: string) {
    throw new Error("borderInlineStyle#setter");
  }

  get borderInlineWidth(): string {
    throw new Error("borderInlineWidth#getter");
  }
  set borderInlineWidth(value: string) {
    throw new Error("borderInlineWidth#setter");
  }

  get borderLeft(): string {
    throw new Error("borderLeft#getter");
  }
  set borderLeft(value: string) {
    throw new Error("borderLeft#setter");
  }

  get borderLeftColor(): string {
    throw new Error("borderLeftColor#getter");
  }
  set borderLeftColor(value: string) {
    throw new Error("borderLeftColor#setter");
  }

  get borderLeftStyle(): string {
    throw new Error("borderLeftStyle#getter");
  }
  set borderLeftStyle(value: string) {
    throw new Error("borderLeftStyle#setter");
  }

  get borderLeftWidth(): string {
    throw new Error("borderLeftWidth#getter");
  }
  set borderLeftWidth(value: string) {
    throw new Error("borderLeftWidth#setter");
  }

  get borderRadius(): string {
    throw new Error("borderRadius#getter");
  }
  set borderRadius(value: string) {
    throw new Error("borderRadius#setter");
  }

  get borderRight(): string {
    throw new Error("borderRight#getter");
  }
  set borderRight(value: string) {
    throw new Error("borderRight#setter");
  }

  get borderRightColor(): string {
    throw new Error("borderRightColor#getter");
  }
  set borderRightColor(value: string) {
    throw new Error("borderRightColor#setter");
  }

  get borderRightStyle(): string {
    throw new Error("borderRightStyle#getter");
  }
  set borderRightStyle(value: string) {
    throw new Error("borderRightStyle#setter");
  }

  get borderRightWidth(): string {
    throw new Error("borderRightWidth#getter");
  }
  set borderRightWidth(value: string) {
    throw new Error("borderRightWidth#setter");
  }

  get borderSpacing(): string {
    throw new Error("borderSpacing#getter");
  }
  set borderSpacing(value: string) {
    throw new Error("borderSpacing#setter");
  }

  get borderStartEndRadius(): string {
    throw new Error("borderStartEndRadius#getter");
  }
  set borderStartEndRadius(value: string) {
    throw new Error("borderStartEndRadius#setter");
  }

  get borderStartStartRadius(): string {
    throw new Error("borderStartStartRadius#getter");
  }
  set borderStartStartRadius(value: string) {
    throw new Error("borderStartStartRadius#setter");
  }

  get borderStyle(): string {
    throw new Error("borderStyle#getter");
  }
  set borderStyle(value: string) {
    throw new Error("borderStyle#setter");
  }

  get borderTop(): string {
    throw new Error("borderTop#getter");
  }
  set borderTop(value: string) {
    throw new Error("borderTop#setter");
  }

  get borderTopColor(): string {
    throw new Error("borderTopColor#getter");
  }
  set borderTopColor(value: string) {
    throw new Error("borderTopColor#setter");
  }

  get borderTopLeftRadius(): string {
    throw new Error("borderTopLeftRadius#getter");
  }
  set borderTopLeftRadius(value: string) {
    throw new Error("borderTopLeftRadius#setter");
  }

  get borderTopRightRadius(): string {
    throw new Error("borderTopRightRadius#getter");
  }
  set borderTopRightRadius(value: string) {
    throw new Error("borderTopRightRadius#setter");
  }

  get borderTopStyle(): string {
    throw new Error("borderTopStyle#getter");
  }
  set borderTopStyle(value: string) {
    throw new Error("borderTopStyle#setter");
  }

  get borderTopWidth(): string {
    throw new Error("borderTopWidth#getter");
  }
  set borderTopWidth(value: string) {
    throw new Error("borderTopWidth#setter");
  }

  get borderWidth(): string {
    throw new Error("borderWidth#getter");
  }
  set borderWidth(value: string) {
    throw new Error("borderWidth#setter");
  }

  get bottom(): string {
    throw new Error("bottom#getter");
  }
  set bottom(value: string) {
    throw new Error("bottom#setter");
  }

  get boxShadow(): string {
    throw new Error("boxShadow#getter");
  }
  set boxShadow(value: string) {
    throw new Error("boxShadow#setter");
  }

  get boxSizing(): string {
    throw new Error("boxSizing#getter");
  }
  set boxSizing(value: string) {
    throw new Error("boxSizing#setter");
  }

  get breakAfter(): string {
    throw new Error("breakAfter#getter");
  }
  set breakAfter(value: string) {
    throw new Error("breakAfter#setter");
  }

  get breakBefore(): string {
    throw new Error("breakBefore#getter");
  }
  set breakBefore(value: string) {
    throw new Error("breakBefore#setter");
  }

  get breakInside(): string {
    throw new Error("breakInside#getter");
  }
  set breakInside(value: string) {
    throw new Error("breakInside#setter");
  }

  get captionSide(): string {
    throw new Error("captionSide#getter");
  }
  set captionSide(value: string) {
    throw new Error("captionSide#setter");
  }

  get caretColor(): string {
    throw new Error("caretColor#getter");
  }
  set caretColor(value: string) {
    throw new Error("caretColor#setter");
  }

  get clear(): string {
    throw new Error("clear#getter");
  }
  set clear(value: string) {
    throw new Error("clear#setter");
  }

  get clip(): string {
    throw new Error("clip#getter");
  }
  set clip(value: string) {
    throw new Error("clip#setter");
  }

  get clipPath(): string {
    throw new Error("clipPath#getter");
  }
  set clipPath(value: string) {
    throw new Error("clipPath#setter");
  }
  get clipRule(): string {
    throw new Error("clipRule#getter");
  }
  set clipRule(value: string) {
    throw new Error("clipRule#setter");
  }

  get color(): string {
    throw new Error("color#getter");
  }
  set color(value: string) {
    throw new Error("color#setter");
  }
  get colorInterpolation(): string {
    throw new Error("colorInterpolation#getter");
  }
  set colorInterpolation(value: string) {
    throw new Error("colorInterpolation#setter");
  }
  get colorInterpolationFilters(): string {
    throw new Error("colorInterpolationFilters#getter");
  }
  set colorInterpolationFilters(value: string) {
    throw new Error("colorInterpolationFilters#setter");
  }

  get colorScheme(): string {
    throw new Error("colorScheme#getter");
  }
  set colorScheme(value: string) {
    throw new Error("colorScheme#setter");
  }

  get columnCount(): string {
    throw new Error("columnCount#getter");
  }
  set columnCount(value: string) {
    throw new Error("columnCount#setter");
  }

  get columnFill(): string {
    throw new Error("columnFill#getter");
  }
  set columnFill(value: string) {
    throw new Error("columnFill#setter");
  }

  get columnGap(): string {
    throw new Error("columnGap#getter");
  }
  set columnGap(value: string) {
    throw new Error("columnGap#setter");
  }

  get columnRule(): string {
    throw new Error("columnRule#getter");
  }
  set columnRule(value: string) {
    throw new Error("columnRule#setter");
  }

  get columnRuleColor(): string {
    throw new Error("columnRuleColor#getter");
  }
  set columnRuleColor(value: string) {
    throw new Error("columnRuleColor#setter");
  }

  get columnRuleStyle(): string {
    throw new Error("columnRuleStyle#getter");
  }
  set columnRuleStyle(value: string) {
    throw new Error("columnRuleStyle#setter");
  }

  get columnRuleWidth(): string {
    throw new Error("columnRuleWidth#getter");
  }
  set columnRuleWidth(value: string) {
    throw new Error("columnRuleWidth#setter");
  }

  get columnSpan(): string {
    throw new Error("columnSpan#getter");
  }
  set columnSpan(value: string) {
    throw new Error("columnSpan#setter");
  }

  get columnWidth(): string {
    throw new Error("columnWidth#getter");
  }
  set columnWidth(value: string) {
    throw new Error("columnWidth#setter");
  }

  get columns(): string {
    throw new Error("columns#getter");
  }
  set columns(value: string) {
    throw new Error("columns#setter");
  }

  get contain(): string {
    throw new Error("contain#getter");
  }
  set contain(value: string) {
    throw new Error("contain#setter");
  }

  get containIntrinsicBlockSize(): string {
    throw new Error("containIntrinsicBlockSize#getter");
  }
  set containIntrinsicBlockSize(value: string) {
    throw new Error("containIntrinsicBlockSize#setter");
  }

  get containIntrinsicHeight(): string {
    throw new Error("containIntrinsicHeight#getter");
  }
  set containIntrinsicHeight(value: string) {
    throw new Error("containIntrinsicHeight#setter");
  }

  get containIntrinsicInlineSize(): string {
    throw new Error("containIntrinsicInlineSize#getter");
  }
  set containIntrinsicInlineSize(value: string) {
    throw new Error("containIntrinsicInlineSize#setter");
  }

  get containIntrinsicSize(): string {
    throw new Error("containIntrinsicSize#getter");
  }
  set containIntrinsicSize(value: string) {
    throw new Error("containIntrinsicSize#setter");
  }

  get containIntrinsicWidth(): string {
    throw new Error("containIntrinsicWidth#getter");
  }
  set containIntrinsicWidth(value: string) {
    throw new Error("containIntrinsicWidth#setter");
  }

  get container(): string {
    throw new Error("container#getter");
  }
  set container(value: string) {
    throw new Error("container#setter");
  }

  get containerName(): string {
    throw new Error("containerName#getter");
  }
  set containerName(value: string) {
    throw new Error("containerName#setter");
  }

  get containerType(): string {
    throw new Error("containerType#getter");
  }
  set containerType(value: string) {
    throw new Error("containerType#setter");
  }

  get content(): string {
    throw new Error("content#getter");
  }
  set content(value: string) {
    throw new Error("content#setter");
  }

  get counterIncrement(): string {
    throw new Error("counterIncrement#getter");
  }
  set counterIncrement(value: string) {
    throw new Error("counterIncrement#setter");
  }

  get counterReset(): string {
    throw new Error("counterReset#getter");
  }
  set counterReset(value: string) {
    throw new Error("counterReset#setter");
  }

  get counterSet(): string {
    throw new Error("counterSet#getter");
  }
  set counterSet(value: string) {
    throw new Error("counterSet#setter");
  }

  get cssFloat(): string {
    throw new Error("cssFloat#getter");
  }
  set cssFloat(value: string) {
    throw new Error("cssFloat#setter");
  }
  #cssText = "";

  // TODO(miyauci) Temporary incorrect implementation to pass testing

  get cssText(): string {
    console.warn(
      "CSSStyleDeclaration#cssText#getter does not conform to specification",
    );
    return this.#cssText;
  }

  set cssText(value: string) {
    console.warn(
      "CSSStyleDeclaration#cssText#setter does not conform to specification",
    );
    this.#cssText = value;
    setAttributeValue(this.#ownerNode, "style", value);
  }

  get cursor(): string {
    throw new Error("cursor#getter");
  }
  set cursor(value: string) {
    throw new Error("cursor#setter");
  }

  get direction(): string {
    throw new Error("direction#getter");
  }
  set direction(value: string) {
    throw new Error("direction#setter");
  }

  get display(): string {
    throw new Error("display#getter");
  }
  set display(value: string) {
    console.warn("style.display setter is ignored");
    // throw new Error("display#setter");
  }
  get dominantBaseline(): string {
    throw new Error("dominantBaseline#getter");
  }
  set dominantBaseline(value: string) {
    throw new Error("dominantBaseline#setter");
  }

  get emptyCells(): string {
    throw new Error("emptyCells#getter");
  }
  set emptyCells(value: string) {
    throw new Error("emptyCells#setter");
  }
  get fill(): string {
    throw new Error("fill#getter");
  }
  set fill(value: string) {
    throw new Error("fill#setter");
  }
  get fillOpacity(): string {
    throw new Error("fillOpacity#getter");
  }
  set fillOpacity(value: string) {
    throw new Error("fillOpacity#setter");
  }
  get fillRule(): string {
    throw new Error("fillRule#getter");
  }
  set fillRule(value: string) {
    throw new Error("fillRule#setter");
  }

  get filter(): string {
    throw new Error("filter#getter");
  }
  set filter(value: string) {
    throw new Error("filter#setter");
  }

  get flex(): string {
    throw new Error("flex#getter");
  }
  set flex(value: string) {
    throw new Error("flex#setter");
  }

  get flexBasis(): string {
    throw new Error("flexBasis#getter");
  }
  set flexBasis(value: string) {
    throw new Error("flexBasis#setter");
  }

  get flexDirection(): string {
    throw new Error("flexDirection#getter");
  }
  set flexDirection(value: string) {
    throw new Error("flexDirection#setter");
  }

  get flexFlow(): string {
    throw new Error("flexFlow#getter");
  }
  set flexFlow(value: string) {
    throw new Error("flexFlow#setter");
  }

  get flexGrow(): string {
    throw new Error("flexGrow#getter");
  }
  set flexGrow(value: string) {
    throw new Error("flexGrow#setter");
  }

  get flexShrink(): string {
    throw new Error("flexShrink#getter");
  }
  set flexShrink(value: string) {
    throw new Error("flexShrink#setter");
  }

  get flexWrap(): string {
    throw new Error("flexWrap#getter");
  }
  set flexWrap(value: string) {
    throw new Error("flexWrap#setter");
  }

  get float(): string {
    throw new Error("float#getter");
  }
  set float(value: string) {
    throw new Error("float#setter");
  }
  get floodColor(): string {
    throw new Error("floodColor#getter");
  }
  set floodColor(value: string) {
    throw new Error("floodColor#setter");
  }
  get floodOpacity(): string {
    throw new Error("floodOpacity#getter");
  }
  set floodOpacity(value: string) {
    throw new Error("floodOpacity#setter");
  }

  get font(): string {
    throw new Error("font#getter");
  }
  set font(value: string) {
    throw new Error("font#setter");
  }

  get fontFamily(): string {
    throw new Error("fontFamily#getter");
  }
  set fontFamily(value: string) {
    throw new Error("fontFamily#setter");
  }

  get fontFeatureSettings(): string {
    throw new Error("fontFeatureSettings#getter");
  }
  set fontFeatureSettings(value: string) {
    throw new Error("fontFeatureSettings#setter");
  }

  get fontKerning(): string {
    throw new Error("fontKerning#getter");
  }
  set fontKerning(value: string) {
    throw new Error("fontKerning#setter");
  }

  get fontOpticalSizing(): string {
    throw new Error("fontOpticalSizing#getter");
  }
  set fontOpticalSizing(value: string) {
    throw new Error("fontOpticalSizing#setter");
  }

  get fontPalette(): string {
    throw new Error("fontPalette#getter");
  }
  set fontPalette(value: string) {
    throw new Error("fontPalette#setter");
  }

  get fontSize(): string {
    throw new Error("fontSize#getter");
  }
  set fontSize(value: string) {
    throw new Error("fontSize#setter");
  }

  get fontSizeAdjust(): string {
    throw new Error("fontSizeAdjust#getter");
  }
  set fontSizeAdjust(value: string) {
    throw new Error("fontSizeAdjust#setter");
  }

  get fontStretch(): string {
    throw new Error("fontStretch#getter");
  }
  set fontStretch(value: string) {
    throw new Error("fontStretch#setter");
  }

  get fontStyle(): string {
    throw new Error("fontStyle#getter");
  }
  set fontStyle(value: string) {
    throw new Error("fontStyle#setter");
  }

  get fontSynthesis(): string {
    throw new Error("fontSynthesis#getter");
  }
  set fontSynthesis(value: string) {
    throw new Error("fontSynthesis#setter");
  }
  get fontSynthesisSmallCaps(): string {
    throw new Error("fontSynthesisSmallCaps#getter");
  }
  set fontSynthesisSmallCaps(value: string) {
    throw new Error("fontSynthesisSmallCaps#setter");
  }
  get fontSynthesisStyle(): string {
    throw new Error("fontSynthesisStyle#getter");
  }
  set fontSynthesisStyle(value: string) {
    throw new Error("fontSynthesisStyle#setter");
  }
  get fontSynthesisWeight(): string {
    throw new Error("fontSynthesisWeight#getter");
  }
  set fontSynthesisWeight(value: string) {
    throw new Error("fontSynthesisWeight#setter");
  }

  get fontVariant(): string {
    throw new Error("fontVariant#getter");
  }
  set fontVariant(value: string) {
    throw new Error("fontVariant#setter");
  }

  get fontVariantAlternates(): string {
    throw new Error("fontVariantAlternates#getter");
  }
  set fontVariantAlternates(value: string) {
    throw new Error("fontVariantAlternates#setter");
  }

  get fontVariantCaps(): string {
    throw new Error("fontVariantCaps#getter");
  }
  set fontVariantCaps(value: string) {
    throw new Error("fontVariantCaps#setter");
  }

  get fontVariantEastAsian(): string {
    throw new Error("fontVariantEastAsian#getter");
  }
  set fontVariantEastAsian(value: string) {
    throw new Error("fontVariantEastAsian#setter");
  }

  get fontVariantLigatures(): string {
    throw new Error("fontVariantLigatures#getter");
  }
  set fontVariantLigatures(value: string) {
    throw new Error("fontVariantLigatures#setter");
  }

  get fontVariantNumeric(): string {
    throw new Error("fontVariantNumeric#getter");
  }
  set fontVariantNumeric(value: string) {
    throw new Error("fontVariantNumeric#setter");
  }

  get fontVariantPosition(): string {
    throw new Error("fontVariantPosition#getter");
  }
  set fontVariantPosition(value: string) {
    throw new Error("fontVariantPosition#setter");
  }

  get fontVariationSettings(): string {
    throw new Error("fontVariationSettings#getter");
  }
  set fontVariationSettings(value: string) {
    throw new Error("fontVariationSettings#setter");
  }

  get fontWeight(): string {
    throw new Error("fontWeight#getter");
  }
  set fontWeight(value: string) {
    throw new Error("fontWeight#setter");
  }

  get gap(): string {
    throw new Error("gap#getter");
  }
  set gap(value: string) {
    throw new Error("gap#setter");
  }

  get grid(): string {
    throw new Error("grid#getter");
  }
  set grid(value: string) {
    throw new Error("grid#setter");
  }

  get gridArea(): string {
    throw new Error("gridArea#getter");
  }
  set gridArea(value: string) {
    throw new Error("gridArea#setter");
  }

  get gridAutoColumns(): string {
    throw new Error("gridAutoColumns#getter");
  }
  set gridAutoColumns(value: string) {
    throw new Error("gridAutoColumns#setter");
  }

  get gridAutoFlow(): string {
    throw new Error("gridAutoFlow#getter");
  }
  set gridAutoFlow(value: string) {
    throw new Error("gridAutoFlow#setter");
  }

  get gridAutoRows(): string {
    throw new Error("gridAutoRows#getter");
  }
  set gridAutoRows(value: string) {
    throw new Error("gridAutoRows#setter");
  }

  get gridColumn(): string {
    throw new Error("gridColumn#getter");
  }
  set gridColumn(value: string) {
    throw new Error("gridColumn#setter");
  }

  get gridColumnEnd(): string {
    throw new Error("gridColumnEnd#getter");
  }
  set gridColumnEnd(value: string) {
    throw new Error("gridColumnEnd#setter");
  }

  get gridColumnGap(): string {
    throw new Error("gridColumnGap#getter");
  }
  set gridColumnGap(value: string) {
    throw new Error("gridColumnGap#setter");
  }

  get gridColumnStart(): string {
    throw new Error("gridColumnStart#getter");
  }
  set gridColumnStart(value: string) {
    throw new Error("gridColumnStart#setter");
  }

  get gridGap(): string {
    throw new Error("gridGap#getter");
  }
  set gridGap(value: string) {
    throw new Error("gridGap#setter");
  }

  get gridRow(): string {
    throw new Error("gridRow#getter");
  }
  set gridRow(value: string) {
    throw new Error("gridRow#setter");
  }

  get gridRowEnd(): string {
    throw new Error("gridRowEnd#getter");
  }
  set gridRowEnd(value: string) {
    throw new Error("gridRowEnd#setter");
  }

  get gridRowGap(): string {
    throw new Error("gridRowGap#getter");
  }
  set gridRowGap(value: string) {
    throw new Error("gridRowGap#setter");
  }

  get gridRowStart(): string {
    throw new Error("gridRowStart#getter");
  }
  set gridRowStart(value: string) {
    throw new Error("gridRowStart#setter");
  }

  get gridTemplate(): string {
    throw new Error("gridTemplate#getter");
  }
  set gridTemplate(value: string) {
    throw new Error("gridTemplate#setter");
  }

  get gridTemplateAreas(): string {
    throw new Error("gridTemplateAreas#getter");
  }
  set gridTemplateAreas(value: string) {
    throw new Error("gridTemplateAreas#setter");
  }

  get gridTemplateColumns(): string {
    throw new Error("gridTemplateColumns#getter");
  }
  set gridTemplateColumns(value: string) {
    throw new Error("gridTemplateColumns#setter");
  }

  get gridTemplateRows(): string {
    throw new Error("gridTemplateRows#getter");
  }
  set gridTemplateRows(value: string) {
    throw new Error("gridTemplateRows#setter");
  }

  get height(): string {
    throw new Error("height#getter");
  }
  set height(value: string) {
    throw new Error("height#setter");
  }

  get hyphenateCharacter(): string {
    throw new Error("hyphenateCharacter#getter");
  }
  set hyphenateCharacter(value: string) {
    throw new Error("hyphenateCharacter#setter");
  }

  get hyphens(): string {
    throw new Error("hyphens#getter");
  }
  set hyphens(value: string) {
    throw new Error("hyphens#setter");
  }

  get imageOrientation(): string {
    throw new Error("imageOrientation#getter");
  }
  set imageOrientation(value: string) {
    throw new Error("imageOrientation#setter");
  }

  get imageRendering(): string {
    throw new Error("imageRendering#getter");
  }
  set imageRendering(value: string) {
    throw new Error("imageRendering#setter");
  }

  get inlineSize(): string {
    throw new Error("inlineSize#getter");
  }
  set inlineSize(value: string) {
    throw new Error("inlineSize#setter");
  }

  get inset(): string {
    throw new Error("inset#getter");
  }
  set inset(value: string) {
    throw new Error("inset#setter");
  }

  get insetBlock(): string {
    throw new Error("insetBlock#getter");
  }
  set insetBlock(value: string) {
    throw new Error("insetBlock#setter");
  }

  get insetBlockEnd(): string {
    throw new Error("insetBlockEnd#getter");
  }
  set insetBlockEnd(value: string) {
    throw new Error("insetBlockEnd#setter");
  }

  get insetBlockStart(): string {
    throw new Error("insetBlockStart#getter");
  }
  set insetBlockStart(value: string) {
    throw new Error("insetBlockStart#setter");
  }

  get insetInline(): string {
    throw new Error("insetInline#getter");
  }
  set insetInline(value: string) {
    throw new Error("insetInline#setter");
  }

  get insetInlineEnd(): string {
    throw new Error("insetInlineEnd#getter");
  }
  set insetInlineEnd(value: string) {
    throw new Error("insetInlineEnd#setter");
  }

  get insetInlineStart(): string {
    throw new Error("insetInlineStart#getter");
  }
  set insetInlineStart(value: string) {
    throw new Error("insetInlineStart#setter");
  }

  get isolation(): string {
    throw new Error("isolation#getter");
  }
  set isolation(value: string) {
    throw new Error("isolation#setter");
  }

  get justifyContent(): string {
    throw new Error("justifyContent#getter");
  }
  set justifyContent(value: string) {
    throw new Error("justifyContent#setter");
  }

  get justifyItems(): string {
    throw new Error("justifyItems#getter");
  }
  set justifyItems(value: string) {
    throw new Error("justifyItems#setter");
  }

  get justifySelf(): string {
    throw new Error("justifySelf#getter");
  }
  set justifySelf(value: string) {
    throw new Error("justifySelf#setter");
  }

  get left(): string {
    throw new Error("left#getter");
  }
  set left(value: string) {
    throw new Error("left#setter");
  }

  get length(): number {
    throw new Error("length#getter");
  }

  get letterSpacing(): string {
    throw new Error("letterSpacing#getter");
  }
  set letterSpacing(value: string) {
    throw new Error("letterSpacing#setter");
  }
  get lightingColor(): string {
    throw new Error("lightingColor#getter");
  }
  set lightingColor(value: string) {
    throw new Error("lightingColor#setter");
  }

  get lineBreak(): string {
    throw new Error("lineBreak#getter");
  }
  set lineBreak(value: string) {
    throw new Error("lineBreak#setter");
  }

  get lineHeight(): string {
    throw new Error("lineHeight#getter");
  }
  set lineHeight(value: string) {
    throw new Error("lineHeight#setter");
  }

  get listStyle(): string {
    throw new Error("listStyle#getter");
  }
  set listStyle(value: string) {
    throw new Error("listStyle#setter");
  }

  get listStyleImage(): string {
    throw new Error("listStyleImage#getter");
  }
  set listStyleImage(value: string) {
    throw new Error("listStyleImage#setter");
  }

  get listStylePosition(): string {
    throw new Error("listStylePosition#getter");
  }
  set listStylePosition(value: string) {
    throw new Error("listStylePosition#setter");
  }

  get listStyleType(): string {
    throw new Error("listStyleType#getter");
  }
  set listStyleType(value: string) {
    throw new Error("listStyleType#setter");
  }

  get margin(): string {
    throw new Error("margin#getter");
  }
  set margin(value: string) {
    throw new Error("margin#setter");
  }

  get marginBlock(): string {
    throw new Error("marginBlock#getter");
  }
  set marginBlock(value: string) {
    throw new Error("marginBlock#setter");
  }

  get marginBlockEnd(): string {
    throw new Error("marginBlockEnd#getter");
  }
  set marginBlockEnd(value: string) {
    throw new Error("marginBlockEnd#setter");
  }

  get marginBlockStart(): string {
    throw new Error("marginBlockStart#getter");
  }
  set marginBlockStart(value: string) {
    throw new Error("marginBlockStart#setter");
  }

  get marginBottom(): string {
    throw new Error("marginBottom#getter");
  }
  set marginBottom(value: string) {
    throw new Error("marginBottom#setter");
  }

  get marginInline(): string {
    throw new Error("marginInline#getter");
  }
  set marginInline(value: string) {
    throw new Error("marginInline#setter");
  }

  get marginInlineEnd(): string {
    throw new Error("marginInlineEnd#getter");
  }
  set marginInlineEnd(value: string) {
    throw new Error("marginInlineEnd#setter");
  }

  get marginInlineStart(): string {
    throw new Error("marginInlineStart#getter");
  }
  set marginInlineStart(value: string) {
    throw new Error("marginInlineStart#setter");
  }

  get marginLeft(): string {
    throw new Error("marginLeft#getter");
  }
  set marginLeft(value: string) {
    throw new Error("marginLeft#setter");
  }

  get marginRight(): string {
    throw new Error("marginRight#getter");
  }
  set marginRight(value: string) {
    throw new Error("marginRight#setter");
  }

  get marginTop(): string {
    throw new Error("marginTop#getter");
  }
  set marginTop(value: string) {
    throw new Error("marginTop#setter");
  }
  get marker(): string {
    throw new Error("marker#getter");
  }
  set marker(value: string) {
    throw new Error("marker#setter");
  }
  get markerEnd(): string {
    throw new Error("markerEnd#getter");
  }
  set markerEnd(value: string) {
    throw new Error("markerEnd#setter");
  }
  get markerMid(): string {
    throw new Error("markerMid#getter");
  }
  set markerMid(value: string) {
    throw new Error("markerMid#setter");
  }
  get markerStart(): string {
    throw new Error("markerStart#getter");
  }
  set markerStart(value: string) {
    throw new Error("markerStart#setter");
  }

  get mask(): string {
    throw new Error("mask#getter");
  }
  set mask(value: string) {
    throw new Error("mask#setter");
  }

  get maskClip(): string {
    throw new Error("maskClip#getter");
  }
  set maskClip(value: string) {
    throw new Error("maskClip#setter");
  }

  get maskComposite(): string {
    throw new Error("maskComposite#getter");
  }
  set maskComposite(value: string) {
    throw new Error("maskComposite#setter");
  }

  get maskImage(): string {
    throw new Error("maskImage#getter");
  }
  set maskImage(value: string) {
    throw new Error("maskImage#setter");
  }

  get maskMode(): string {
    throw new Error("maskMode#getter");
  }
  set maskMode(value: string) {
    throw new Error("maskMode#setter");
  }

  get maskOrigin(): string {
    throw new Error("maskOrigin#getter");
  }
  set maskOrigin(value: string) {
    throw new Error("maskOrigin#setter");
  }

  get maskPosition(): string {
    throw new Error("maskPosition#getter");
  }
  set maskPosition(value: string) {
    throw new Error("maskPosition#setter");
  }

  get maskRepeat(): string {
    throw new Error("maskRepeat#getter");
  }
  set maskRepeat(value: string) {
    throw new Error("maskRepeat#setter");
  }

  get maskSize(): string {
    throw new Error("maskSize#getter");
  }
  set maskSize(value: string) {
    throw new Error("maskSize#setter");
  }

  get maskType(): string {
    throw new Error("maskType#getter");
  }
  set maskType(value: string) {
    throw new Error("maskType#setter");
  }

  get mathStyle(): string {
    throw new Error("mathStyle#getter");
  }
  set mathStyle(value: string) {
    throw new Error("mathStyle#setter");
  }

  get maxBlockSize(): string {
    throw new Error("maxBlockSize#getter");
  }
  set maxBlockSize(value: string) {
    throw new Error("maxBlockSize#setter");
  }

  get maxHeight(): string {
    throw new Error("maxHeight#getter");
  }
  set maxHeight(value: string) {
    throw new Error("maxHeight#setter");
  }

  get maxInlineSize(): string {
    throw new Error("maxInlineSize#getter");
  }
  set maxInlineSize(value: string) {
    throw new Error("maxInlineSize#setter");
  }

  get maxWidth(): string {
    throw new Error("maxWidth#getter");
  }
  set maxWidth(value: string) {
    throw new Error("maxWidth#setter");
  }

  get minBlockSize(): string {
    throw new Error("minBlockSize#getter");
  }
  set minBlockSize(value: string) {
    throw new Error("minBlockSize#setter");
  }

  get minHeight(): string {
    throw new Error("minHeight#getter");
  }
  set minHeight(value: string) {
    throw new Error("minHeight#setter");
  }

  get minInlineSize(): string {
    throw new Error("minInlineSize#getter");
  }
  set minInlineSize(value: string) {
    throw new Error("minInlineSize#setter");
  }

  get minWidth(): string {
    throw new Error("minWidth#getter");
  }
  set minWidth(value: string) {
    throw new Error("minWidth#setter");
  }

  get mixBlendMode(): string {
    throw new Error("mixBlendMode#getter");
  }
  set mixBlendMode(value: string) {
    throw new Error("mixBlendMode#setter");
  }

  get objectFit(): string {
    throw new Error("objectFit#getter");
  }
  set objectFit(value: string) {
    throw new Error("objectFit#setter");
  }

  get objectPosition(): string {
    throw new Error("objectPosition#getter");
  }
  set objectPosition(value: string) {
    throw new Error("objectPosition#setter");
  }

  get offset(): string {
    throw new Error("offset#getter");
  }
  set offset(value: string) {
    throw new Error("offset#setter");
  }

  get offsetDistance(): string {
    throw new Error("offsetDistance#getter");
  }
  set offsetDistance(value: string) {
    throw new Error("offsetDistance#setter");
  }

  get offsetPath(): string {
    throw new Error("offsetPath#getter");
  }
  set offsetPath(value: string) {
    throw new Error("offsetPath#setter");
  }

  get offsetRotate(): string {
    throw new Error("offsetRotate#getter");
  }
  set offsetRotate(value: string) {
    throw new Error("offsetRotate#setter");
  }

  get opacity(): string {
    throw new Error("opacity#getter");
  }
  set opacity(value: string) {
    throw new Error("opacity#setter");
  }

  get order(): string {
    throw new Error("order#getter");
  }
  set order(value: string) {
    throw new Error("order#setter");
  }

  get orphans(): string {
    throw new Error("orphans#getter");
  }
  set orphans(value: string) {
    throw new Error("orphans#setter");
  }

  get outline(): string {
    throw new Error("outline#getter");
  }
  set outline(value: string) {
    throw new Error("outline#setter");
  }

  get outlineColor(): string {
    throw new Error("outlineColor#getter");
  }
  set outlineColor(value: string) {
    throw new Error("outlineColor#setter");
  }

  get outlineOffset(): string {
    throw new Error("outlineOffset#getter");
  }
  set outlineOffset(value: string) {
    throw new Error("outlineOffset#setter");
  }

  get outlineStyle(): string {
    throw new Error("outlineStyle#getter");
  }
  set outlineStyle(value: string) {
    throw new Error("outlineStyle#setter");
  }

  get outlineWidth(): string {
    throw new Error("outlineWidth#getter");
  }
  set outlineWidth(value: string) {
    throw new Error("outlineWidth#setter");
  }

  get overflow(): string {
    throw new Error("overflow#getter");
  }
  set overflow(value: string) {
    throw new Error("overflow#setter");
  }

  get overflowAnchor(): string {
    throw new Error("overflowAnchor#getter");
  }
  set overflowAnchor(value: string) {
    throw new Error("overflowAnchor#setter");
  }

  get overflowClipMargin(): string {
    throw new Error("overflowClipMargin#getter");
  }
  set overflowClipMargin(value: string) {
    throw new Error("overflowClipMargin#setter");
  }

  get overflowWrap(): string {
    throw new Error("overflowWrap#getter");
  }
  set overflowWrap(value: string) {
    throw new Error("overflowWrap#setter");
  }

  get overflowX(): string {
    throw new Error("overflowX#getter");
  }
  set overflowX(value: string) {
    throw new Error("overflowX#setter");
  }

  get overflowY(): string {
    throw new Error("overflowY#getter");
  }
  set overflowY(value: string) {
    throw new Error("overflowY#setter");
  }

  get overscrollBehavior(): string {
    throw new Error("overscrollBehavior#getter");
  }
  set overscrollBehavior(value: string) {
    throw new Error("overscrollBehavior#setter");
  }

  get overscrollBehaviorBlock(): string {
    throw new Error("overscrollBehaviorBlock#getter");
  }
  set overscrollBehaviorBlock(value: string) {
    throw new Error("overscrollBehaviorBlock#setter");
  }

  get overscrollBehaviorInline(): string {
    throw new Error("overscrollBehaviorInline#getter");
  }
  set overscrollBehaviorInline(value: string) {
    throw new Error("overscrollBehaviorInline#setter");
  }

  get overscrollBehaviorX(): string {
    throw new Error("overscrollBehaviorX#getter");
  }
  set overscrollBehaviorX(value: string) {
    throw new Error("overscrollBehaviorX#setter");
  }

  get overscrollBehaviorY(): string {
    throw new Error("overscrollBehaviorY#getter");
  }
  set overscrollBehaviorY(value: string) {
    throw new Error("overscrollBehaviorY#setter");
  }

  get padding(): string {
    throw new Error("padding#getter");
  }
  set padding(value: string) {
    throw new Error("padding#setter");
  }

  get paddingBlock(): string {
    throw new Error("paddingBlock#getter");
  }
  set paddingBlock(value: string) {
    throw new Error("paddingBlock#setter");
  }

  get paddingBlockEnd(): string {
    throw new Error("paddingBlockEnd#getter");
  }
  set paddingBlockEnd(value: string) {
    throw new Error("paddingBlockEnd#setter");
  }

  get paddingBlockStart(): string {
    throw new Error("paddingBlockStart#getter");
  }
  set paddingBlockStart(value: string) {
    throw new Error("paddingBlockStart#setter");
  }

  get paddingBottom(): string {
    throw new Error("paddingBottom#getter");
  }
  set paddingBottom(value: string) {
    throw new Error("paddingBottom#setter");
  }

  get paddingInline(): string {
    throw new Error("paddingInline#getter");
  }
  set paddingInline(value: string) {
    throw new Error("paddingInline#setter");
  }

  get paddingInlineEnd(): string {
    throw new Error("paddingInlineEnd#getter");
  }
  set paddingInlineEnd(value: string) {
    throw new Error("paddingInlineEnd#setter");
  }

  get paddingInlineStart(): string {
    throw new Error("paddingInlineStart#getter");
  }
  set paddingInlineStart(value: string) {
    throw new Error("paddingInlineStart#setter");
  }

  get paddingLeft(): string {
    throw new Error("paddingLeft#getter");
  }
  set paddingLeft(value: string) {
    throw new Error("paddingLeft#setter");
  }

  get paddingRight(): string {
    throw new Error("paddingRight#getter");
  }
  set paddingRight(value: string) {
    throw new Error("paddingRight#setter");
  }

  get paddingTop(): string {
    throw new Error("paddingTop#getter");
  }
  set paddingTop(value: string) {
    throw new Error("paddingTop#setter");
  }

  get page(): string {
    throw new Error("page#getter");
  }
  set page(value: string) {
    throw new Error("page#setter");
  }

  get pageBreakAfter(): string {
    throw new Error("pageBreakAfter#getter");
  }
  set pageBreakAfter(value: string) {
    throw new Error("pageBreakAfter#setter");
  }

  get pageBreakBefore(): string {
    throw new Error("pageBreakBefore#getter");
  }
  set pageBreakBefore(value: string) {
    throw new Error("pageBreakBefore#setter");
  }

  get pageBreakInside(): string {
    throw new Error("pageBreakInside#getter");
  }
  set pageBreakInside(value: string) {
    throw new Error("pageBreakInside#setter");
  }

  get paintOrder(): string {
    throw new Error("paintOrder#getter");
  }
  set paintOrder(value: string) {
    throw new Error("paintOrder#setter");
  }

  get parentRule(): CSSRule | null {
    throw new Error("parentRule#getter");
  }

  get perspective(): string {
    throw new Error("perspective#getter");
  }
  set perspective(value: string) {
    throw new Error("perspective#setter");
  }

  get perspectiveOrigin(): string {
    throw new Error("perspectiveOrigin#getter");
  }
  set perspectiveOrigin(value: string) {
    throw new Error("perspectiveOrigin#setter");
  }

  get placeContent(): string {
    throw new Error("placeContent#getter");
  }
  set placeContent(value: string) {
    throw new Error("placeContent#setter");
  }

  get placeItems(): string {
    throw new Error("placeItems#getter");
  }
  set placeItems(value: string) {
    throw new Error("placeItems#setter");
  }

  get placeSelf(): string {
    throw new Error("placeSelf#getter");
  }
  set placeSelf(value: string) {
    throw new Error("placeSelf#setter");
  }

  get pointerEvents(): string {
    throw new Error("pointerEvents#getter");
  }
  set pointerEvents(value: string) {
    throw new Error("pointerEvents#setter");
  }

  get position(): string {
    throw new Error("position#getter");
  }
  set position(value: string) {
    throw new Error("position#setter");
  }

  get printColorAdjust(): string {
    throw new Error("printColorAdjust#getter");
  }
  set printColorAdjust(value: string) {
    throw new Error("printColorAdjust#setter");
  }

  get quotes(): string {
    throw new Error("quotes#getter");
  }
  set quotes(value: string) {
    throw new Error("quotes#setter");
  }

  get resize(): string {
    throw new Error("resize#getter");
  }
  set resize(value: string) {
    throw new Error("resize#setter");
  }

  get right(): string {
    throw new Error("right#getter");
  }
  set right(value: string) {
    throw new Error("right#setter");
  }

  get rotate(): string {
    throw new Error("rotate#getter");
  }
  set rotate(value: string) {
    throw new Error("rotate#setter");
  }

  get rowGap(): string {
    throw new Error("rowGap#getter");
  }
  set rowGap(value: string) {
    throw new Error("rowGap#setter");
  }

  get rubyPosition(): string {
    throw new Error("rubyPosition#getter");
  }
  set rubyPosition(value: string) {
    throw new Error("rubyPosition#setter");
  }

  get scale(): string {
    throw new Error("scale#getter");
  }
  set scale(value: string) {
    throw new Error("scale#setter");
  }

  get scrollBehavior(): string {
    throw new Error("scrollBehavior#getter");
  }
  set scrollBehavior(value: string) {
    throw new Error("scrollBehavior#setter");
  }

  get scrollMargin(): string {
    throw new Error("scrollMargin#getter");
  }
  set scrollMargin(value: string) {
    throw new Error("scrollMargin#setter");
  }

  get scrollMarginBlock(): string {
    throw new Error("scrollMarginBlock#getter");
  }
  set scrollMarginBlock(value: string) {
    throw new Error("scrollMarginBlock#setter");
  }

  get scrollMarginBlockEnd(): string {
    throw new Error("scrollMarginBlockEnd#getter");
  }
  set scrollMarginBlockEnd(value: string) {
    throw new Error("scrollMarginBlockEnd#setter");
  }

  get scrollMarginBlockStart(): string {
    throw new Error("scrollMarginBlockStart#getter");
  }
  set scrollMarginBlockStart(value: string) {
    throw new Error("scrollMarginBlockStart#setter");
  }

  get scrollMarginBottom(): string {
    throw new Error("scrollMarginBottom#getter");
  }
  set scrollMarginBottom(value: string) {
    throw new Error("scrollMarginBottom#setter");
  }

  get scrollMarginInline(): string {
    throw new Error("scrollMarginInline#getter");
  }
  set scrollMarginInline(value: string) {
    throw new Error("scrollMarginInline#setter");
  }

  get scrollMarginInlineEnd(): string {
    throw new Error("scrollMarginInlineEnd#getter");
  }
  set scrollMarginInlineEnd(value: string) {
    throw new Error("scrollMarginInlineEnd#setter");
  }

  get scrollMarginInlineStart(): string {
    throw new Error("scrollMarginInlineStart#getter");
  }
  set scrollMarginInlineStart(value: string) {
    throw new Error("scrollMarginInlineStart#setter");
  }

  get scrollMarginLeft(): string {
    throw new Error("scrollMarginLeft#getter");
  }
  set scrollMarginLeft(value: string) {
    throw new Error("scrollMarginLeft#setter");
  }

  get scrollMarginRight(): string {
    throw new Error("scrollMarginRight#getter");
  }
  set scrollMarginRight(value: string) {
    throw new Error("scrollMarginRight#setter");
  }

  get scrollMarginTop(): string {
    throw new Error("scrollMarginTop#getter");
  }
  set scrollMarginTop(value: string) {
    throw new Error("scrollMarginTop#setter");
  }

  get scrollPadding(): string {
    throw new Error("scrollPadding#getter");
  }
  set scrollPadding(value: string) {
    throw new Error("scrollPadding#setter");
  }

  get scrollPaddingBlock(): string {
    throw new Error("scrollPaddingBlock#getter");
  }
  set scrollPaddingBlock(value: string) {
    throw new Error("scrollPaddingBlock#setter");
  }

  get scrollPaddingBlockEnd(): string {
    throw new Error("scrollPaddingBlockEnd#getter");
  }
  set scrollPaddingBlockEnd(value: string) {
    throw new Error("scrollPaddingBlockEnd#setter");
  }

  get scrollPaddingBlockStart(): string {
    throw new Error("scrollPaddingBlockStart#getter");
  }
  set scrollPaddingBlockStart(value: string) {
    throw new Error("scrollPaddingBlockStart#setter");
  }

  get scrollPaddingBottom(): string {
    throw new Error("scrollPaddingBottom#getter");
  }
  set scrollPaddingBottom(value: string) {
    throw new Error("scrollPaddingBottom#setter");
  }

  get scrollPaddingInline(): string {
    throw new Error("scrollPaddingInline#getter");
  }
  set scrollPaddingInline(value: string) {
    throw new Error("scrollPaddingInline#setter");
  }

  get scrollPaddingInlineEnd(): string {
    throw new Error("scrollPaddingInlineEnd#getter");
  }
  set scrollPaddingInlineEnd(value: string) {
    throw new Error("scrollPaddingInlineEnd#setter");
  }

  get scrollPaddingInlineStart(): string {
    throw new Error("scrollPaddingInlineStart#getter");
  }
  set scrollPaddingInlineStart(value: string) {
    throw new Error("scrollPaddingInlineStart#setter");
  }

  get scrollPaddingLeft(): string {
    throw new Error("scrollPaddingLeft#getter");
  }
  set scrollPaddingLeft(value: string) {
    throw new Error("scrollPaddingLeft#setter");
  }

  get scrollPaddingRight(): string {
    throw new Error("scrollPaddingRight#getter");
  }
  set scrollPaddingRight(value: string) {
    throw new Error("scrollPaddingRight#setter");
  }

  get scrollPaddingTop(): string {
    throw new Error("scrollPaddingTop#getter");
  }
  set scrollPaddingTop(value: string) {
    throw new Error("scrollPaddingTop#setter");
  }

  get scrollSnapAlign(): string {
    throw new Error("scrollSnapAlign#getter");
  }
  set scrollSnapAlign(value: string) {
    throw new Error("scrollSnapAlign#setter");
  }

  get scrollSnapStop(): string {
    throw new Error("scrollSnapStop#getter");
  }
  set scrollSnapStop(value: string) {
    throw new Error("scrollSnapStop#setter");
  }

  get scrollSnapType(): string {
    throw new Error("scrollSnapType#getter");
  }
  set scrollSnapType(value: string) {
    throw new Error("scrollSnapType#setter");
  }

  get scrollbarGutter(): string {
    throw new Error("scrollbarGutter#getter");
  }
  set scrollbarGutter(value: string) {
    throw new Error("scrollbarGutter#setter");
  }

  get shapeImageThreshold(): string {
    throw new Error("shapeImageThreshold#getter");
  }
  set shapeImageThreshold(value: string) {
    throw new Error("shapeImageThreshold#setter");
  }

  get shapeMargin(): string {
    throw new Error("shapeMargin#getter");
  }
  set shapeMargin(value: string) {
    throw new Error("shapeMargin#setter");
  }

  get shapeOutside(): string {
    throw new Error("shapeOutside#getter");
  }
  set shapeOutside(value: string) {
    throw new Error("shapeOutside#setter");
  }
  get shapeRendering(): string {
    throw new Error("shapeRendering#getter");
  }
  set shapeRendering(value: string) {
    throw new Error("shapeRendering#setter");
  }
  get stopColor(): string {
    throw new Error("stopColor#getter");
  }
  set stopColor(value: string) {
    throw new Error("stopColor#setter");
  }
  get stopOpacity(): string {
    throw new Error("stopOpacity#getter");
  }
  set stopOpacity(value: string) {
    throw new Error("stopOpacity#setter");
  }
  get stroke(): string {
    throw new Error("stroke#getter");
  }
  set stroke(value: string) {
    throw new Error("stroke#setter");
  }
  get strokeDasharray(): string {
    throw new Error("strokeDasharray#getter");
  }
  set strokeDasharray(value: string) {
    throw new Error("strokeDasharray#setter");
  }
  get strokeDashoffset(): string {
    throw new Error("strokeDashoffset#getter");
  }
  set strokeDashoffset(value: string) {
    throw new Error("strokeDashoffset#setter");
  }
  get strokeLinecap(): string {
    throw new Error("strokeLinecap#getter");
  }
  set strokeLinecap(value: string) {
    throw new Error("strokeLinecap#setter");
  }
  get strokeLinejoin(): string {
    throw new Error("strokeLinejoin#getter");
  }
  set strokeLinejoin(value: string) {
    throw new Error("strokeLinejoin#setter");
  }
  get strokeMiterlimit(): string {
    throw new Error("strokeMiterlimit#getter");
  }
  set strokeMiterlimit(value: string) {
    throw new Error("strokeMiterlimit#setter");
  }
  get strokeOpacity(): string {
    throw new Error("strokeOpacity#getter");
  }
  set strokeOpacity(value: string) {
    throw new Error("strokeOpacity#setter");
  }
  get strokeWidth(): string {
    throw new Error("strokeWidth#getter");
  }
  set strokeWidth(value: string) {
    throw new Error("strokeWidth#setter");
  }

  get tabSize(): string {
    throw new Error("tabSize#getter");
  }
  set tabSize(value: string) {
    throw new Error("tabSize#setter");
  }

  get tableLayout(): string {
    throw new Error("tableLayout#getter");
  }
  set tableLayout(value: string) {
    throw new Error("tableLayout#setter");
  }

  get textAlign(): string {
    throw new Error("textAlign#getter");
  }
  set textAlign(value: string) {
    throw new Error("textAlign#setter");
  }

  get textAlignLast(): string {
    throw new Error("textAlignLast#getter");
  }
  set textAlignLast(value: string) {
    throw new Error("textAlignLast#setter");
  }
  get textAnchor(): string {
    throw new Error("textAnchor#getter");
  }
  set textAnchor(value: string) {
    throw new Error("textAnchor#setter");
  }

  get textCombineUpright(): string {
    throw new Error("textCombineUpright#getter");
  }
  set textCombineUpright(value: string) {
    throw new Error("textCombineUpright#setter");
  }

  get textDecoration(): string {
    throw new Error("textDecoration#getter");
  }
  set textDecoration(value: string) {
    throw new Error("textDecoration#setter");
  }

  get textDecorationColor(): string {
    throw new Error("textDecorationColor#getter");
  }
  set textDecorationColor(value: string) {
    throw new Error("textDecorationColor#setter");
  }

  get textDecorationLine(): string {
    throw new Error("textDecorationLine#getter");
  }
  set textDecorationLine(value: string) {
    throw new Error("textDecorationLine#setter");
  }

  get textDecorationSkipInk(): string {
    throw new Error("textDecorationSkipInk#getter");
  }
  set textDecorationSkipInk(value: string) {
    throw new Error("textDecorationSkipInk#setter");
  }

  get textDecorationStyle(): string {
    throw new Error("textDecorationStyle#getter");
  }
  set textDecorationStyle(value: string) {
    throw new Error("textDecorationStyle#setter");
  }

  get textDecorationThickness(): string {
    throw new Error("textDecorationThickness#getter");
  }
  set textDecorationThickness(value: string) {
    throw new Error("textDecorationThickness#setter");
  }

  get textEmphasis(): string {
    throw new Error("textEmphasis#getter");
  }
  set textEmphasis(value: string) {
    throw new Error("textEmphasis#setter");
  }

  get textEmphasisColor(): string {
    throw new Error("textEmphasisColor#getter");
  }
  set textEmphasisColor(value: string) {
    throw new Error("textEmphasisColor#setter");
  }

  get textEmphasisPosition(): string {
    throw new Error("textEmphasisPosition#getter");
  }
  set textEmphasisPosition(value: string) {
    throw new Error("textEmphasisPosition#setter");
  }

  get textEmphasisStyle(): string {
    throw new Error("textEmphasisStyle#getter");
  }
  set textEmphasisStyle(value: string) {
    throw new Error("textEmphasisStyle#setter");
  }

  get textIndent(): string {
    throw new Error("textIndent#getter");
  }
  set textIndent(value: string) {
    throw new Error("textIndent#setter");
  }

  get textOrientation(): string {
    throw new Error("textOrientation#getter");
  }
  set textOrientation(value: string) {
    throw new Error("textOrientation#setter");
  }

  get textOverflow(): string {
    throw new Error("textOverflow#getter");
  }
  set textOverflow(value: string) {
    throw new Error("textOverflow#setter");
  }

  get textRendering(): string {
    throw new Error("textRendering#getter");
  }
  set textRendering(value: string) {
    throw new Error("textRendering#setter");
  }

  get textShadow(): string {
    throw new Error("textShadow#getter");
  }
  set textShadow(value: string) {
    throw new Error("textShadow#setter");
  }

  get textTransform(): string {
    throw new Error("textTransform#getter");
  }
  set textTransform(value: string) {
    throw new Error("textTransform#setter");
  }

  get textUnderlineOffset(): string {
    throw new Error("textUnderlineOffset#getter");
  }
  set textUnderlineOffset(value: string) {
    throw new Error("textUnderlineOffset#setter");
  }

  get textUnderlinePosition(): string {
    throw new Error("textUnderlinePosition#getter");
  }
  set textUnderlinePosition(value: string) {
    throw new Error("textUnderlinePosition#setter");
  }

  get top(): string {
    throw new Error("top#getter");
  }
  set top(value: string) {
    throw new Error("top#setter");
  }

  get touchAction(): string {
    throw new Error("touchAction#getter");
  }
  set touchAction(value: string) {
    throw new Error("touchAction#setter");
  }

  get transform(): string {
    throw new Error("transform#getter");
  }
  set transform(value: string) {
    throw new Error("transform#setter");
  }

  get transformBox(): string {
    throw new Error("transformBox#getter");
  }
  set transformBox(value: string) {
    throw new Error("transformBox#setter");
  }

  get transformOrigin(): string {
    throw new Error("transformOrigin#getter");
  }
  set transformOrigin(value: string) {
    throw new Error("transformOrigin#setter");
  }

  get transformStyle(): string {
    throw new Error("transformStyle#getter");
  }
  set transformStyle(value: string) {
    throw new Error("transformStyle#setter");
  }

  get transition(): string {
    throw new Error("transition#getter");
  }
  set transition(value: string) {
    throw new Error("transition#setter");
  }

  get transitionDelay(): string {
    throw new Error("transitionDelay#getter");
  }
  set transitionDelay(value: string) {
    throw new Error("transitionDelay#setter");
  }

  get transitionDuration(): string {
    throw new Error("transitionDuration#getter");
  }
  set transitionDuration(value: string) {
    throw new Error("transitionDuration#setter");
  }

  get transitionProperty(): string {
    throw new Error("transitionProperty#getter");
  }
  set transitionProperty(value: string) {
    throw new Error("transitionProperty#setter");
  }

  get transitionTimingFunction(): string {
    throw new Error("transitionTimingFunction#getter");
  }
  set transitionTimingFunction(value: string) {
    throw new Error("transitionTimingFunction#setter");
  }

  get translate(): string {
    throw new Error("translate#getter");
  }
  set translate(value: string) {
    throw new Error("translate#setter");
  }

  get unicodeBidi(): string {
    throw new Error("unicodeBidi#getter");
  }
  set unicodeBidi(value: string) {
    throw new Error("unicodeBidi#setter");
  }

  get userSelect(): string {
    throw new Error("userSelect#getter");
  }
  set userSelect(value: string) {
    throw new Error("userSelect#setter");
  }

  get verticalAlign(): string {
    throw new Error("verticalAlign#getter");
  }
  set verticalAlign(value: string) {
    throw new Error("verticalAlign#setter");
  }

  get visibility(): string {
    throw new Error("visibility#getter");
  }
  set visibility(value: string) {
    throw new Error("visibility#setter");
  }

  get webkitAlignContent(): string {
    throw new Error("webkitAlignContent#getter");
  }
  set webkitAlignContent(value: string) {
    throw new Error("webkitAlignContent#setter");
  }

  get webkitAlignItems(): string {
    throw new Error("webkitAlignItems#getter");
  }
  set webkitAlignItems(value: string) {
    throw new Error("webkitAlignItems#setter");
  }

  get webkitAlignSelf(): string {
    throw new Error("webkitAlignSelf#getter");
  }
  set webkitAlignSelf(value: string) {
    throw new Error("webkitAlignSelf#setter");
  }

  get webkitAnimation(): string {
    throw new Error("webkitAnimation#getter");
  }
  set webkitAnimation(value: string) {
    throw new Error("webkitAnimation#setter");
  }

  get webkitAnimationDelay(): string {
    throw new Error("webkitAnimationDelay#getter");
  }
  set webkitAnimationDelay(value: string) {
    throw new Error("webkitAnimationDelay#setter");
  }

  get webkitAnimationDirection(): string {
    throw new Error("webkitAnimationDirection#getter");
  }
  set webkitAnimationDirection(value: string) {
    throw new Error("webkitAnimationDirection#setter");
  }

  get webkitAnimationDuration(): string {
    throw new Error("webkitAnimationDuration#getter");
  }
  set webkitAnimationDuration(value: string) {
    throw new Error("webkitAnimationDuration#setter");
  }

  get webkitAnimationFillMode(): string {
    throw new Error("webkitAnimationFillMode#getter");
  }
  set webkitAnimationFillMode(value: string) {
    throw new Error("webkitAnimationFillMode#setter");
  }

  get webkitAnimationIterationCount(): string {
    throw new Error("webkitAnimationIterationCount#getter");
  }
  set webkitAnimationIterationCount(value: string) {
    throw new Error("webkitAnimationIterationCount#setter");
  }

  get webkitAnimationName(): string {
    throw new Error("webkitAnimationName#getter");
  }
  set webkitAnimationName(value: string) {
    throw new Error("webkitAnimationName#setter");
  }

  get webkitAnimationPlayState(): string {
    throw new Error("webkitAnimationPlayState#getter");
  }
  set webkitAnimationPlayState(value: string) {
    throw new Error("webkitAnimationPlayState#setter");
  }

  get webkitAnimationTimingFunction(): string {
    throw new Error("webkitAnimationTimingFunction#getter");
  }
  set webkitAnimationTimingFunction(value: string) {
    throw new Error("webkitAnimationTimingFunction#setter");
  }

  get webkitAppearance(): string {
    throw new Error("webkitAppearance#getter");
  }
  set webkitAppearance(value: string) {
    throw new Error("webkitAppearance#setter");
  }

  get webkitBackfaceVisibility(): string {
    throw new Error("webkitBackfaceVisibility#getter");
  }
  set webkitBackfaceVisibility(value: string) {
    throw new Error("webkitBackfaceVisibility#setter");
  }

  get webkitBackgroundClip(): string {
    throw new Error("webkitBackgroundClip#getter");
  }
  set webkitBackgroundClip(value: string) {
    throw new Error("webkitBackgroundClip#setter");
  }

  get webkitBackgroundOrigin(): string {
    throw new Error("webkitBackgroundOrigin#getter");
  }
  set webkitBackgroundOrigin(value: string) {
    throw new Error("webkitBackgroundOrigin#setter");
  }

  get webkitBackgroundSize(): string {
    throw new Error("webkitBackgroundSize#getter");
  }
  set webkitBackgroundSize(value: string) {
    throw new Error("webkitBackgroundSize#setter");
  }

  get webkitBorderBottomLeftRadius(): string {
    throw new Error("webkitBorderBottomLeftRadius#getter");
  }
  set webkitBorderBottomLeftRadius(value: string) {
    throw new Error("webkitBorderBottomLeftRadius#setter");
  }

  get webkitBorderBottomRightRadius(): string {
    throw new Error("webkitBorderBottomRightRadius#getter");
  }
  set webkitBorderBottomRightRadius(value: string) {
    throw new Error("webkitBorderBottomRightRadius#setter");
  }

  get webkitBorderRadius(): string {
    throw new Error("webkitBorderRadius#getter");
  }
  set webkitBorderRadius(value: string) {
    throw new Error("webkitBorderRadius#setter");
  }

  get webkitBorderTopLeftRadius(): string {
    throw new Error("webkitBorderTopLeftRadius#getter");
  }
  set webkitBorderTopLeftRadius(value: string) {
    throw new Error("webkitBorderTopLeftRadius#setter");
  }

  get webkitBorderTopRightRadius(): string {
    throw new Error("webkitBorderTopRightRadius#getter");
  }
  set webkitBorderTopRightRadius(value: string) {
    throw new Error("webkitBorderTopRightRadius#setter");
  }

  get webkitBoxAlign(): string {
    throw new Error("webkitBoxAlign#getter");
  }
  set webkitBoxAlign(value: string) {
    throw new Error("webkitBoxAlign#setter");
  }

  get webkitBoxFlex(): string {
    throw new Error("webkitBoxFlex#getter");
  }
  set webkitBoxFlex(value: string) {
    throw new Error("webkitBoxFlex#setter");
  }

  get webkitBoxOrdinalGroup(): string {
    throw new Error("webkitBoxOrdinalGroup#getter");
  }
  set webkitBoxOrdinalGroup(value: string) {
    throw new Error("webkitBoxOrdinalGroup#setter");
  }

  get webkitBoxOrient(): string {
    throw new Error("webkitBoxOrient#getter");
  }
  set webkitBoxOrient(value: string) {
    throw new Error("webkitBoxOrient#setter");
  }

  get webkitBoxPack(): string {
    throw new Error("webkitBoxPack#getter");
  }
  set webkitBoxPack(value: string) {
    throw new Error("webkitBoxPack#setter");
  }

  get webkitBoxShadow(): string {
    throw new Error("webkitBoxShadow#getter");
  }
  set webkitBoxShadow(value: string) {
    throw new Error("webkitBoxShadow#setter");
  }

  get webkitBoxSizing(): string {
    throw new Error("webkitBoxSizing#getter");
  }
  set webkitBoxSizing(value: string) {
    throw new Error("webkitBoxSizing#setter");
  }

  get webkitFilter(): string {
    throw new Error("webkitFilter#getter");
  }
  set webkitFilter(value: string) {
    throw new Error("webkitFilter#setter");
  }

  get webkitFlex(): string {
    throw new Error("webkitFlex#getter");
  }
  set webkitFlex(value: string) {
    throw new Error("webkitFlex#setter");
  }

  get webkitFlexBasis(): string {
    throw new Error("webkitFlexBasis#getter");
  }
  set webkitFlexBasis(value: string) {
    throw new Error("webkitFlexBasis#setter");
  }

  get webkitFlexDirection(): string {
    throw new Error("webkitFlexDirection#getter");
  }
  set webkitFlexDirection(value: string) {
    throw new Error("webkitFlexDirection#setter");
  }

  get webkitFlexFlow(): string {
    throw new Error("webkitFlexFlow#getter");
  }
  set webkitFlexFlow(value: string) {
    throw new Error("webkitFlexFlow#setter");
  }

  get webkitFlexGrow(): string {
    throw new Error("webkitFlexGrow#getter");
  }
  set webkitFlexGrow(value: string) {
    throw new Error("webkitFlexGrow#setter");
  }

  get webkitFlexShrink(): string {
    throw new Error("webkitFlexShrink#getter");
  }
  set webkitFlexShrink(value: string) {
    throw new Error("webkitFlexShrink#setter");
  }

  get webkitFlexWrap(): string {
    throw new Error("webkitFlexWrap#getter");
  }
  set webkitFlexWrap(value: string) {
    throw new Error("webkitFlexWrap#setter");
  }

  get webkitJustifyContent(): string {
    throw new Error("webkitJustifyContent#getter");
  }
  set webkitJustifyContent(value: string) {
    throw new Error("webkitJustifyContent#setter");
  }

  get webkitLineClamp(): string {
    throw new Error("webkitLineClamp#getter");
  }
  set webkitLineClamp(value: string) {
    throw new Error("webkitLineClamp#setter");
  }

  get webkitMask(): string {
    throw new Error("webkitMask#getter");
  }
  set webkitMask(value: string) {
    throw new Error("webkitMask#setter");
  }

  get webkitMaskBoxImage(): string {
    throw new Error("webkitMaskBoxImage#getter");
  }
  set webkitMaskBoxImage(value: string) {
    throw new Error("webkitMaskBoxImage#setter");
  }

  get webkitMaskBoxImageOutset(): string {
    throw new Error("webkitMaskBoxImageOutset#getter");
  }
  set webkitMaskBoxImageOutset(value: string) {
    throw new Error("webkitMaskBoxImageOutset#setter");
  }

  get webkitMaskBoxImageRepeat(): string {
    throw new Error("webkitMaskBoxImageRepeat#getter");
  }
  set webkitMaskBoxImageRepeat(value: string) {
    throw new Error("webkitMaskBoxImageRepeat#setter");
  }

  get webkitMaskBoxImageSlice(): string {
    throw new Error("webkitMaskBoxImageSlice#getter");
  }
  set webkitMaskBoxImageSlice(value: string) {
    throw new Error("webkitMaskBoxImageSlice#setter");
  }

  get webkitMaskBoxImageSource(): string {
    throw new Error("webkitMaskBoxImageSource#getter");
  }
  set webkitMaskBoxImageSource(value: string) {
    throw new Error("webkitMaskBoxImageSource#setter");
  }

  get webkitMaskBoxImageWidth(): string {
    throw new Error("webkitMaskBoxImageWidth#getter");
  }
  set webkitMaskBoxImageWidth(value: string) {
    throw new Error("webkitMaskBoxImageWidth#setter");
  }

  get webkitMaskClip(): string {
    throw new Error("webkitMaskClip#getter");
  }
  set webkitMaskClip(value: string) {
    throw new Error("webkitMaskClip#setter");
  }

  get webkitMaskComposite(): string {
    throw new Error("webkitMaskComposite#getter");
  }
  set webkitMaskComposite(value: string) {
    throw new Error("webkitMaskComposite#setter");
  }

  get webkitMaskImage(): string {
    throw new Error("webkitMaskImage#getter");
  }
  set webkitMaskImage(value: string) {
    throw new Error("webkitMaskImage#setter");
  }

  get webkitMaskOrigin(): string {
    throw new Error("webkitMaskOrigin#getter");
  }
  set webkitMaskOrigin(value: string) {
    throw new Error("webkitMaskOrigin#setter");
  }

  get webkitMaskPosition(): string {
    throw new Error("webkitMaskPosition#getter");
  }
  set webkitMaskPosition(value: string) {
    throw new Error("webkitMaskPosition#setter");
  }

  get webkitMaskRepeat(): string {
    throw new Error("webkitMaskRepeat#getter");
  }
  set webkitMaskRepeat(value: string) {
    throw new Error("webkitMaskRepeat#setter");
  }

  get webkitMaskSize(): string {
    throw new Error("webkitMaskSize#getter");
  }
  set webkitMaskSize(value: string) {
    throw new Error("webkitMaskSize#setter");
  }

  get webkitOrder(): string {
    throw new Error("webkitOrder#getter");
  }
  set webkitOrder(value: string) {
    throw new Error("webkitOrder#setter");
  }

  get webkitPerspective(): string {
    throw new Error("webkitPerspective#getter");
  }
  set webkitPerspective(value: string) {
    throw new Error("webkitPerspective#setter");
  }

  get webkitPerspectiveOrigin(): string {
    throw new Error("webkitPerspectiveOrigin#getter");
  }
  set webkitPerspectiveOrigin(value: string) {
    throw new Error("webkitPerspectiveOrigin#setter");
  }

  get webkitTextFillColor(): string {
    throw new Error("webkitTextFillColor#getter");
  }
  set webkitTextFillColor(value: string) {
    throw new Error("webkitTextFillColor#setter");
  }

  get webkitTextSizeAdjust(): string {
    throw new Error("webkitTextSizeAdjust#getter");
  }
  set webkitTextSizeAdjust(value: string) {
    throw new Error("webkitTextSizeAdjust#setter");
  }

  get webkitTextStroke(): string {
    throw new Error("webkitTextStroke#getter");
  }
  set webkitTextStroke(value: string) {
    throw new Error("webkitTextStroke#setter");
  }

  get webkitTextStrokeColor(): string {
    throw new Error("webkitTextStrokeColor#getter");
  }
  set webkitTextStrokeColor(value: string) {
    throw new Error("webkitTextStrokeColor#setter");
  }

  get webkitTextStrokeWidth(): string {
    throw new Error("webkitTextStrokeWidth#getter");
  }
  set webkitTextStrokeWidth(value: string) {
    throw new Error("webkitTextStrokeWidth#setter");
  }

  get webkitTransform(): string {
    throw new Error("webkitTransform#getter");
  }
  set webkitTransform(value: string) {
    throw new Error("webkitTransform#setter");
  }

  get webkitTransformOrigin(): string {
    throw new Error("webkitTransformOrigin#getter");
  }
  set webkitTransformOrigin(value: string) {
    throw new Error("webkitTransformOrigin#setter");
  }

  get webkitTransformStyle(): string {
    throw new Error("webkitTransformStyle#getter");
  }
  set webkitTransformStyle(value: string) {
    throw new Error("webkitTransformStyle#setter");
  }

  get webkitTransition(): string {
    throw new Error("webkitTransition#getter");
  }
  set webkitTransition(value: string) {
    throw new Error("webkitTransition#setter");
  }

  get webkitTransitionDelay(): string {
    throw new Error("webkitTransitionDelay#getter");
  }
  set webkitTransitionDelay(value: string) {
    throw new Error("webkitTransitionDelay#setter");
  }

  get webkitTransitionDuration(): string {
    throw new Error("webkitTransitionDuration#getter");
  }
  set webkitTransitionDuration(value: string) {
    throw new Error("webkitTransitionDuration#setter");
  }

  get webkitTransitionProperty(): string {
    throw new Error("webkitTransitionProperty#getter");
  }
  set webkitTransitionProperty(value: string) {
    throw new Error("webkitTransitionProperty#setter");
  }

  get webkitTransitionTimingFunction(): string {
    throw new Error("webkitTransitionTimingFunction#getter");
  }
  set webkitTransitionTimingFunction(value: string) {
    throw new Error("webkitTransitionTimingFunction#setter");
  }

  get webkitUserSelect(): string {
    throw new Error("webkitUserSelect#getter");
  }
  set webkitUserSelect(value: string) {
    throw new Error("webkitUserSelect#setter");
  }

  get whiteSpace(): string {
    throw new Error("whiteSpace#getter");
  }
  set whiteSpace(value: string) {
    throw new Error("whiteSpace#setter");
  }

  get widows(): string {
    throw new Error("widows#getter");
  }
  set widows(value: string) {
    throw new Error("widows#setter");
  }

  get width(): string {
    throw new Error("width#getter");
  }
  set width(value: string) {
    throw new Error("width#setter");
  }

  get willChange(): string {
    throw new Error("willChange#getter");
  }
  set willChange(value: string) {
    throw new Error("willChange#setter");
  }

  get wordBreak(): string {
    throw new Error("wordBreak#getter");
  }
  set wordBreak(value: string) {
    throw new Error("wordBreak#setter");
  }

  get wordSpacing(): string {
    throw new Error("wordSpacing#getter");
  }
  set wordSpacing(value: string) {
    throw new Error("wordSpacing#setter");
  }

  get wordWrap(): string {
    throw new Error("wordWrap#getter");
  }
  set wordWrap(value: string) {
    throw new Error("wordWrap#setter");
  }

  get writingMode(): string {
    throw new Error("writingMode#getter");
  }
  set writingMode(value: string) {
    throw new Error("writingMode#setter");
  }

  get zIndex(): string {
    throw new Error("zIndex#getter");
  }
  set zIndex(value: string) {
    throw new Error("zIndex#setter");
  }

  getPropertyPriority(property: string): string {
    throw new Error("getPropertyPriority");
  }
  getPropertyValue(property: string): string {
    throw new Error("getPropertyValue");
  }

  item(index: number): string {
    throw new Error("item");
  }
  removeProperty(property: string): string {
    throw new Error("removeProperty");
  }
  setProperty(
    property: string,
    value: string | null,
    priority?: string,
  ): void {
    throw new Error("setProperty");
  }

  get forcedColorAdjust(): string {
    throw new Error("forcedColorAdjust#getter");
  }

  set forcedColorAdjust(value: string) {
    throw new Error("forcedColorAdjust#setter");
  }

  *[Symbol.iterator]() {}
}
