<!-- @layer docs @kind doc -->
# Release notes

One file per release, `v<version>.md`, written for the people who use the app. It is the body of the GitHub release, and the updater shows it before an update. The release workflow refuses a version without one, and `brock release-notes check <version>` runs the same check.

The first line is `# <product name> v<version>`, then one paragraph that sums the release up, then `##` sections (New, Changes, View, Settings, Around the app, Platforms, Under the hood, Upgrading, Fixes) of `-` bullets, each a plain sentence. The full format is `docs/release-notes.md` in `@drizztdourden08/standards`.
