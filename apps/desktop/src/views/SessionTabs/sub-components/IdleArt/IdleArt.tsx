/* @layer renderer-app @kind component */
import { Logo } from '@drizztdourden08/tessera/brand';
import { Box } from '@drizztdourden08/tessera/primitives';
import './IdleArt.css';

const IdleArt = () => (
  <Box className="idle-art" aria-hidden="true">
    <Box className="idle-art__mark"><Logo brand="archipelia" size="fill" /></Box>
  </Box>
);

export { IdleArt };
