/* @layer renderer-app @kind constants */
import type { AppTree } from '@drizztdourden08/tessera';

const APP_TREE = [
  {
    at: ['a full screen view'],
    answers: {
      'a page of the multiworld app': {
        question: 'Which page?',
        answers: {
          'the home banner': null,
          'the room that is hosting': null,
          'the saved sessions and their runs': null,
          'a session being built': null,
          'the games to install': null,
          'the presets of every game': null,
          'one preset being edited': null,
          'the saved servers': null,
          'the engine': null,
          'the archipelago.gg owner id': null,
          'the data on disk': {
            question: 'Which part of it?',
            answers: { 'the folder sizes': null, 'the old runs to clean': null, 'a library export': null, 'a library import': null },
          },
        },
      },
    },
  },
  {
    at: ['a value the user sets'],
    answers: {
      'a game option': {
        question: 'How much of the option?',
        answers: { 'its control alone': null, 'the frame around a control': null, 'the whole row from its definition': null },
      },
      'how a session is generated and hosted': null,
    },
  },
  {
    at: ['data'],
    answers: {
      'a game in the store': null,
      'a player of a session': {
        question: 'Where is the player?',
        answers: { 'in the session builder': null, 'in a live room': null },
      },
      'a hint in a live room': null,
      'a past run of a session': null,
      'a saved session template': null,
      'a preset in a list': null,
    },
  },
  { at: ['navigation'], answers: { 'between the option groups of a game': null } },
  { at: ['something over the page'], answers: { 'a session run as it starts': null } },
  { at: ['feedback'], answers: { 'a session as it generates and starts': null } },
  { at: ['layout', 'window chrome'], answers: { 'the bar of a hosted room': null } },
] as const satisfies AppTree;

export { APP_TREE };
