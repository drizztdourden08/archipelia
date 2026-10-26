/* @layer renderer-app @kind component */
import logoUrl from '@drizztdourden08/tessera/brand/light-rim/archipelia/icon/icon.svg';
import { Image } from '@drizztdourden08/tessera/primitives';
import './IdleArt.css';

const IdleArt = () => <Image className="idle-art" src={logoUrl} alt="" fit="contain" placeholder="none" aria-hidden="true" draggable={false} />;

export { IdleArt };
