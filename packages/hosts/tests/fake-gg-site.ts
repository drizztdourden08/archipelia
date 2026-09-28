/* @layer tests @kind test */
type FakeOptions = { failPort?: boolean };

const createFakeGgSite = ({ failPort = false }: FakeOptions = {}) => {
  const base = 'https://gg.test';
  const owner = '0f0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f0f';
  const seed = 'c2VlZA';
  const room = 'cm9vbQ';
  const site = { base, owner, room, commands: [] as string[], uploads: [] as { name: string; cookie: string }[], stopped: false };
  let log = Buffer.alloc(0);
  let statusCalls = 0;

  const appendLog = (text: string) => { log = Buffer.concat([log, Buffer.from(text, 'utf8')]); };
  const redirect = (location: string) => new Response(null, { status: 302, headers: { location } });

  const roomCommand = (body: string) => {
    const cmd = new URLSearchParams(body).get('cmd') ?? '';
    site.commands.push(cmd);
    if (cmd.startsWith('/option password ')) appendLog(`[t]: Set option password to ${cmd.slice(17)}\n`);
    if (cmd === '/exit') site.stopped = true;
    return redirect(`/room/${room}`);
  };

  const lastPortOf = (hosting: boolean) => {
    if (failPort) return -1;
    return hosting ? 38281 : 0;
  };

  const status = () => {
    statusCalls += 1;
    const hosting = statusCalls >= 2;
    if (hosting && !failPort && !log.includes('Hosting')) appendLog('[t]: Hosting game at gg.test:38281\n');
    const lastPort = lastPortOf(hosting);
    const activity = site.stopped ? Date.now() - 3 * 3600 * 1000 : Date.now();
    const body = { tracker: 't', players: [], last_port: lastPort, last_activity: new Date(activity).toUTCString(), timeout: 7200, downloads: [] };
    return Response.json(body);
  };

  const readLog = (range: string | null) => {
    if (log.length === 0) return new Response('Logfile logs/x.txt does not exist. Likely a crash during spinup.');
    const from = range ? Number(range.replace('bytes=', '').replace('-', '')) : 0;
    return new Response(log.subarray(from), { status: range ? 206 : 200 });
  };

  const upload = (init: RequestInit, headers: Headers) => {
    const file = (init.body as FormData).get('file') as File;
    site.uploads.push({ name: file.name, cookie: headers.get('cookie') ?? '' });
    return redirect(`/seed/${seed}`);
  };

  const routeRoom = (path: string, init: RequestInit, headers: Headers) => {
    if (path === `/room/${room}`) return init.method === 'POST' ? roomCommand(String(init.body)) : new Response('<html></html>');
    if (path === `/api/room_status/${room}`) return status();
    if (path === `/log/${room}`) return readLog(headers.get('range'));
    return new Response('not found', { status: 404 });
  };

  const route = (url: URL, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    const path = url.pathname;
    if (path === `/session/${owner}`) return new Response('ok', { headers: { 'set-cookie': 'session=owner-cookie; Path=/' } });
    if (path === '/uploads' && init.method === 'POST') return upload(init, headers);
    if (path === `/new_room/${seed}`) return redirect(`/room/${room}`);
    return routeRoom(path, init, headers);
  };

  const respond: typeof fetch = (input, init) => Promise.resolve(route(new URL(String(input)), init));

  return Object.assign(site, { appendLog, fetch: respond });
};

export { createFakeGgSite };
