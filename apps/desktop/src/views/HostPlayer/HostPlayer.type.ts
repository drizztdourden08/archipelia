/* @layer renderer-app @kind types */
type HostPlayerProps = { serverId: string; lobbyId: string };

type HostPlayerDraft = { game: string; presetId: string; name: string };

export type { HostPlayerDraft, HostPlayerProps };
