/* @layer tests @kind helper */
import { connectWebSocket } from '@drizztdourden08/archipelia-lobby-protocol/testing';

type Reply = { type: string; ok?: boolean; result?: Record<string, unknown>; [key: string]: unknown };

const adminCall = async (url: string, token: string, type: string, params: Record<string, unknown>): Promise<Reply> => {
  const socket = await connectWebSocket(url);
  const replies: Reply[] = [];
  const waiting: ((reply: Reply) => void)[] = [];
  socket.listen((event) => {
    if (event.kind !== 'text') return;
    const reply = JSON.parse(event.text) as Reply;
    const next = waiting.shift();
    if (next) next(reply);
    else replies.push(reply);
  });
  const take = () => new Promise<Reply>((resolve) => {
    const first = replies.shift();
    if (first) resolve(first);
    else waiting.push(resolve);
  });
  socket.send(JSON.stringify({ type: 'admin.hello', seq: 1, token }));
  await take();
  socket.send(JSON.stringify({ type, seq: 2, ...params }));
  let reply = await take();
  while (reply.type !== 'admin.reply') reply = await take();
  socket.close();
  return reply;
};

export { adminCall };
