import * as React from "react";
import { createComponent, type EventName } from "@lit/react";
import {
  ChaosVolumeGymElement,
  normalizeVolume,
  type ChaosVolumeGymProps as CoreVolumeGymProps,
  type VolumeChangeDetail,
  type VolumeCommitDetail,
} from "@sdcorejs/chaos-ui/volume-gym";
import { registerVolumeGym } from "@sdcorejs/chaos-ui/volume-gym/register";
export type {
  VolumeChangeSource,
  VolumeChangeDetail,
  VolumeCommitDetail,
} from "@sdcorejs/chaos-ui/volume-gym";

/** React Volume Gym options. Supply `value` for controlled state or
 * `defaultValue` for state owned by the adapter. Callbacks receive payloads,
 * not CustomEvents.
 * @example <ChaosVolumeGym value={volume} onChange={({value}) => setVolume(value)} />
 */
export interface ChaosVolumeGymProps
  extends
    CoreVolumeGymProps,
    Omit<
      React.HTMLAttributes<ChaosVolumeGymElement>,
      "onChange" | "onCommit" | "defaultValue"
    > {
  /** Initial uncontrolled value, default 0; ignored when `value` is supplied.
   * @example <VolumeGym defaultValue={35} />
   */
  defaultValue?: number;
  /** Effective user/gravity update with `value` and `source`; no host writes.
   * @example onChange={({value, source}) => setVolume(value)}
   */
  onChange?: (detail: VolumeChangeDetail) => void;
  /** Final value after an effective pointer, keyboard or button action.
   * @example onCommit={({value}) => saveVolume(value)}
   */
  onCommit?: (detail: VolumeCommitDetail) => void;
}

/** Short prop name for the `VolumeGym` alias.
 * @example const props: VolumeGymProps = { defaultValue: 40 };
 */
export type VolumeGymProps = ChaosVolumeGymProps;

const Element = createComponent({
  react: React,
  tagName: "chaos-volume-gym-element",
  elementClass: ChaosVolumeGymElement,
  events: {
    onVolumeChange: "change" as EventName<CustomEvent<VolumeChangeDetail>>,
    onVolumeCommit: "commit" as EventName<CustomEvent<VolumeCommitDetail>>,
  },
});

/** React adapter for Volume Gym. Ref points to the inner Web Component.
 * Controlled `value` must be updated from `onChange` to accept user/gravity
 * changes; rejected changes are restored on the next task.
 * @example <ChaosVolumeGym gravity value={volume} onChange={({value}) => setVolume(value)} />
 */
export const ChaosVolumeGym = React.forwardRef<
  ChaosVolumeGymElement,
  ChaosVolumeGymProps
>(function ChaosVolumeGym(
  {
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    onCommit,
    ...props
  },
  ref,
) {
  const element = React.useRef<ChaosVolumeGymElement>(null);
  const [internal, setInternal] = React.useState(() =>
    normalizeVolume(defaultValue ?? 0, min, max, step),
  );
  const controlled = value !== undefined;
  const effective = normalizeVolume(controlled ? value : internal, min, max, step);
  const latestProp = React.useRef(effective);
  const pendingRestore = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  latestProp.current = effective;
  React.useImperativeHandle(ref, () => element.current!, []);
  React.useLayoutEffect(() => {
    registerVolumeGym();
    if (element.current) element.current.value = effective;
  });
  React.useEffect(
    () => () => {
      if (pendingRestore.current !== null) clearTimeout(pendingRestore.current);
    },
    [],
  );
  return React.createElement(Element, {
    ...props,
    ref: element,
    value: effective,
    min,
    max,
    step,
    onVolumeChange: (event: CustomEvent<VolumeChangeDetail>) => {
      if (!controlled) setInternal(event.detail.value);
      onChange?.(event.detail);
      if (controlled) {
        if (pendingRestore.current !== null) clearTimeout(pendingRestore.current);
        pendingRestore.current = setTimeout(() => {
          pendingRestore.current = null;
          if (element.current && element.current.value !== latestProp.current)
            element.current.value = latestProp.current;
        }, 0);
      }
    },
    onVolumeCommit: (event: CustomEvent<VolumeCommitDetail>) =>
      onCommit?.(event.detail),
  });
});

/** Short React export with the same controlled/uncontrolled contract.
 * @example <VolumeGym defaultValue={25} gravity />
 */
export const VolumeGym = ChaosVolumeGym;
