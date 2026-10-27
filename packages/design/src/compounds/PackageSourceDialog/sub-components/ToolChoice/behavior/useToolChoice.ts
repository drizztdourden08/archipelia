/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { ToolWay } from '../../../PackageSourceDialog.type';

const useToolChoice = () => {
  const [way, setWay] = useState<ToolWay>(null);
  return { way, setWay };
};

export { useToolChoice };
