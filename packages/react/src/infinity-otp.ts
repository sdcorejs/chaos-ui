import * as React from "react";
import { createComponent, type EventName } from "@lit/react";
import { ChaosInfinityOtpElement } from "@sdcorejs/chaos-ui/infinity-otp";
import type { InfinityOtpProps as CoreInfinityOtpProps } from "@sdcorejs/chaos-ui/infinity-otp";
import { registerInfinityOtp } from "@sdcorejs/chaos-ui/infinity-otp/register";
import {
  normalizeOtpSlots,
  type OtpSlots,
  type OtpChangeDetail,
  type OtpSubmitDetail,
} from "@sdcorejs/chaos-ui/otp";
export type {
  OtpSlots,
  OtpDigit,
  OtpStatus,
  OtpChangeDetail,
  OtpSubmitDetail,
} from "@sdcorejs/chaos-ui/otp";

/** React props: choose slots + onChange for controlled input, or defaultSlots for uncontrolled.
 * @example <ChaosInfinityOtp slots={slots} onChange={({slots}) => setSlots(slots)} onSubmit={({value}) => verify(value)} />
 */
export interface ChaosInfinityOtpProps
  extends
    CoreInfinityOtpProps,
    Omit<
      React.HTMLAttributes<ChaosInfinityOtpElement>,
      "onChange" | "onSubmit" | "defaultValue"
    > {
  /** Initial uncontrolled slots; ignored after mount and whenever slots is supplied. Default: empty.
   * @example <InfinityOtp defaultSlots={['0',null,null,null,null,null]} />
   */
  defaultSlots?: OtpSlots;
  /** Called once per effective user edit with an immutable positional snapshot. No CustomEvent unwrapping needed.
   * @example onChange={({slots}) => setSlots(slots)}
   */
  onChange?: (detail: OtpChangeDetail) => void;
  /** Called for a new complete user-created value; does not indicate successful verification.
   * @example onComplete={({value}) => announce(value)}
   */
  onComplete?: (detail: OtpSubmitDetail) => void;
  /** Called only on explicit confirmation of a complete, enabled value. Host verifies it.
   * @example onSubmit={({value}) => verify(value)}
   */
  onSubmit?: (detail: OtpSubmitDetail) => void;
}
/** React props for the short `InfinityOtp` export. @example const props: InfinityOtpProps = {status:'idle'}; */
export type InfinityOtpProps = ChaosInfinityOtpProps;
const Element = createComponent({
  react: React,
  tagName: "chaos-infinity-otp-element",
  elementClass: ChaosInfinityOtpElement,
  events: {
    onOtpChange: "change" as EventName<CustomEvent<OtpChangeDetail>>,
    onOtpComplete: "complete" as EventName<CustomEvent<OtpSubmitDetail>>,
    onOtpSubmit: "submit" as EventName<CustomEvent<OtpSubmitDetail>>,
  },
});
/** React adapter for chaos-infinity-otp-element. Forwards a ref to the underlying element.
 * @example <ChaosInfinityOtp defaultSlots={['0',null,null,null,null,null]} onSubmit={({value}) => verify(value)} />
 */
export const ChaosInfinityOtp = React.forwardRef<
  ChaosInfinityOtpElement,
  ChaosInfinityOtpProps
>(function ChaosInfinityOtp(
  { slots, defaultSlots, onChange, onComplete, onSubmit, ...props },
  ref,
) {
  const element = React.useRef<ChaosInfinityOtpElement>(null);
  const [internal, setInternal] = React.useState<OtpSlots>(() =>
    normalizeOtpSlots(defaultSlots, 6),
  );
  const controlled = slots !== undefined;
  const value = React.useMemo(
    () => normalizeOtpSlots(controlled ? slots : internal, 6),
    [controlled, slots, internal],
  );
  React.useImperativeHandle(ref, () => element.current!, []);
  React.useLayoutEffect(() => {
    registerInfinityOtp();
    if (element.current) element.current.slots = value;
  });
  return React.createElement(Element, {
    ...props,
    ref: element,
    slots: value,
    onOtpChange: (event: CustomEvent<OtpChangeDetail>) => {
      if (!controlled) setInternal(event.detail.slots);
      onChange?.(event.detail);
      // Controlled consumers may intentionally reject an edit without rerendering.
      if (controlled && element.current) element.current.slots = value;
    },
    onOtpComplete: (event: CustomEvent<OtpSubmitDetail>) =>
      onComplete?.(event.detail),
    onOtpSubmit: (event: CustomEvent<OtpSubmitDetail>) =>
      onSubmit?.(event.detail),
  });
});
/** Short React export for consumers using the Infinity OTP entrypoint.
 * @example <InfinityOtp slots={slots} onChange={({slots}) => setSlots(slots)} />
 */
export const InfinityOtp = ChaosInfinityOtp;
