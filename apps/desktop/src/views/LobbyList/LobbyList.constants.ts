/* @layer renderer-app @kind config */
const FAILURE = { load: 'Could not load the lobbies.' } as const;

const EMPTY = 'No lobby yet. New lobby opens one and gives you a code to share.';

const SERVER_DOWN = 'The lobby server on this computer is not running, so players cannot join. The Servers page says why.';

const SERVER_STARTING = 'The lobby server on this computer is starting.';

export { EMPTY, FAILURE, SERVER_DOWN, SERVER_STARTING };
