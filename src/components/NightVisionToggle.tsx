import { useNightVision } from './nightVisionState.ts';

export function NightVisionToggle() {
  const { enabled, toggle } = useNightVision();
  return (
    <button type="button" className="nv-toggle" aria-pressed={enabled} onClick={toggle}>
      <span className="nv-lamp" aria-hidden="true" />
      Night vision
      <span className="nv-state">{enabled ? 'On' : 'Off'}</span>
    </button>
  );
}
