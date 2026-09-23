import * as React from "react";
import { createComponent, type EventName } from "@lit/react";
import { ChaosLotoOtpElement } from "@sdcorejs/chaos-ui/loto-otp";
import { registerLotoOtp } from "@sdcorejs/chaos-ui/loto-otp/register";
import {
  normalizeOtpSlots,
  type OtpProps,
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
 * @example <ChaosLotoOtp slots={slots} onChange={({slots}) => setSlots(slots)} onSubmit={({value}) => verify(value)} />
 */
export interface ChaosLotoOtpProps
  extends
    OtpProps,
    Omit<
      React.HTMLAttributes<ChaosLotoOtpElement>,
      "onChange" | "onSubmit" | "defaultValue"
    > {
  /** Initial uncontrolled slots; ignored after mount and whenever slots is supplied. Default: empty. */
  defaultSlots?: OtpSlots;
  /** Called once per effective user edit with an immutable positional snapshot. No CustomEvent unwrapping needed. */
  onChange?: (detail: OtpChangeDetail) => void;
  /** Called for a new complete user-created value; does not indicate successful verification. */
  onComplete?: (detail: OtpSubmitDetail) => void;
  /** Called only on explicit confirmation of a complete, enabled value. Host verifies it. */
  onSubmit?: (detail: OtpSubmitDetail) => void;
}
const Element = createComponent({
  react: React,
  tagName: "chaos-loto-otp-element",
  elementClass: ChaosLotoOtpElement,
  events: {
    onOtpChange: "change" as EventName<CustomEvent<OtpChangeDetail>>,
    onOtpComplete: "complete" as EventName<CustomEvent<OtpSubmitDetail>>,
    onOtpSubmit: "submit" as EventName<CustomEvent<OtpSubmitDetail>>,
  },
});
/** React adapter for chaos-loto-otp-element. Forwards a ref to the underlying element.
 * @example <ChaosLotoOtp defaultSlots={['0',null,null,null,null,null]} onSubmit={({value}) => verify(value)} />
 */
export const ChaosLotoOtp = React.forwardRef<ChaosLotoOtpElement, ChaosLotoOtpProps>(
  function ChaosLotoOtp(
    {
      slots,
      defaultSlots,
      length = 6,
      onChange,
      onComplete,
      onSubmit,
      ...props
    },
    ref,
  ) {
    const element = React.useRef<ChaosLotoOtpElement>(null);
    const [internal, setInternal] = React.useState<OtpSlots>(() =>
      normalizeOtpSlots(defaultSlots, length),
    );
    const controlled = slots !== undefined;
    const value = React.useMemo(
      () => normalizeOtpSlots(controlled ? slots : internal, length),
      [controlled, slots, internal, length],
    );
    React.useLayoutEffect(() => {
      if (!controlled) setInternal((old) => normalizeOtpSlots(old, length));
    }, [length, controlled]);
    React.useImperativeHandle(ref, () => element.current!, []);
    React.useLayoutEffect(() => {
      registerLotoOtp();
      if (element.current) element.current.slots = value;
    });
    return React.createElement(Element, {
      ...props,
      ref: element,
      length,
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
  },
);
