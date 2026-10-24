/* @layer tests @kind data */
const RELEASES_URL_ONE = 'https://api.github.com/repos/ArchipelagoMW/Archipelago/releases?per_page=100';

const RELEASES_URL_TWO = 'https://api.github.com/repositories/1/releases?per_page=100&page=2';

const RELEASES_LINK = `<${RELEASES_URL_TWO}>; rel="next", <${RELEASES_URL_TWO}>; rel="last"`;

const RELEASES_PAGE_ONE = [
  {
    tag_name: '0.6.9-rc1',
    draft: false,
    prerelease: true,
    published_at: '2026-10-20T09:00:00Z',
    html_url: 'https://github.com/ArchipelagoMW/Archipelago/releases/tag/0.6.9-rc1',
  },
  {
    tag_name: '0.6.8',
    draft: false,
    prerelease: false,
    published_at: '2026-10-04T10:00:00Z',
    html_url: 'https://github.com/ArchipelagoMW/Archipelago/releases/tag/0.6.8',
  },
  {
    tag_name: '0.6.7',
    draft: false,
    prerelease: false,
    published_at: '2026-08-01T10:00:00Z',
    html_url: 'https://github.com/ArchipelagoMW/Archipelago/releases/tag/0.6.7',
  },
];

const RELEASES_PAGE_TWO = [
  {
    tag_name: '0.6.9',
    draft: true,
    prerelease: false,
    published_at: '',
    html_url: 'https://github.com/ArchipelagoMW/Archipelago/releases/tag/0.6.9',
  },
  {
    tag_name: '0.6.2',
    draft: false,
    prerelease: false,
    published_at: '2025-06-01T10:00:00Z',
    html_url: 'https://github.com/ArchipelagoMW/Archipelago/releases/tag/0.6.2',
  },
  {
    tag_name: '0.6.1',
    draft: false,
    prerelease: false,
    published_at: '2025-04-01T10:00:00Z',
    html_url: 'https://github.com/ArchipelagoMW/Archipelago/releases/tag/0.6.1',
  },
];

export { RELEASES_LINK, RELEASES_PAGE_ONE, RELEASES_PAGE_TWO, RELEASES_URL_ONE, RELEASES_URL_TWO };
