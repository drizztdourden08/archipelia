/* @layer renderer-app @kind component */
import { BRAND_FAMILY } from '@drizztdourden08/tessera/brand';
import { Svg, SvgPath } from '@drizztdourden08/tessera/primitives';
import './IdleArt.css';

const { viewBox, paths } = BRAND_FAMILY.archipelia.mark;

const IdleArt = () => (
  <Svg className="idle-art" viewBox={viewBox} aria-hidden="true" focusable="false">
    {paths.map(({ d }) => <SvgPath key={d} className="idle-art__path" d={d} fillRule="evenodd" />)}
  </Svg>
);

export { IdleArt };
