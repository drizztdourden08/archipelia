/* @layer renderer-app @kind logic */
import type { NumberSettingKey } from '../../../settings.type';
import { NUMBER_BOUNDS } from '../NumberSetting.constants';

const isNumberSetting = (key: string): key is NumberSettingKey => Object.hasOwn(NUMBER_BOUNDS, key);

export { isNumberSetting };
