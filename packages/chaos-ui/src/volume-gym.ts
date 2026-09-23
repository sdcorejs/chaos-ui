/** Controlled volume contract. No game is shipped yet.
 * @example const props: VolumeGymProps = { value: 40 };
 */
export interface VolumeGymProps {
  /** Volume percentage, 0–100; default 0. Application updates emit no user event. */
  value?: number;
}
