/* @layer tests @kind helper */
type ChestItem = { item: string; receiver: string };

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const chestLineOf = (slot: string): RegExp => new RegExp(`${escaped(slot)} (sent .+ to \\S+|found their .+)`);

const itemOf = (slot: string, text: string): ChestItem => {
  const sent = new RegExp(`${escaped(slot)} sent (.+?) to (\\S+)`).exec(text);
  if (sent?.[1] && sent[2]) return { item: sent[1], receiver: sent[2] };
  const found = new RegExp(`${escaped(slot)} found their (.+?)(?: \\(|$)`).exec(text);
  if (found?.[1]) return { item: found[1], receiver: slot };
  throw new Error(`no chest item in the log line "${text}"`);
};

export { chestLineOf, itemOf };
export type { ChestItem };
