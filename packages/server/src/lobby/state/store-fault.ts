/* @layer core @kind logic */
import { STORE_FAULT, STORE_FAULT_MESSAGE } from './state.constants';

const storeFault = (cause: unknown): Error => Object.assign(new Error(STORE_FAULT_MESSAGE, { cause }), { name: STORE_FAULT });

export { storeFault };
