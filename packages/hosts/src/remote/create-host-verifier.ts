/* @layer core @kind logic */
import type { HostKeyPrompt } from './remote.type';
import { fingerprintSha256 } from './fingerprint-sha256';
import { normalizeFingerprint } from './normalize-fingerprint';

const createHostVerifier = (pinned: string | undefined, onHostKey: HostKeyPrompt) => {
  let refusal: string | undefined;

  const verify = (key: Buffer, answer: (valid: boolean) => void) => {
    const seen = fingerprintSha256(key);
    if (pinned) {
      const same = normalizeFingerprint(pinned) === seen;
      if (!same) refusal = `the server's host key changed: pinned ${normalizeFingerprint(pinned)}, got ${seen}`;
      answer(same);
      return;
    }
    Promise.resolve()
      .then(() => onHostKey(seen))
      .then((accepted) => {
        if (accepted !== true) refusal = `the host key ${seen} was not accepted`;
        answer(accepted === true);
      }, () => answer(false));
  };

  return { verify, refusal: () => refusal };
};

export { createHostVerifier };
