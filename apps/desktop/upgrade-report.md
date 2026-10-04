{
  "applied": [
    {
      "id": "base-setting-controls",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "A setting row that is not a boolean needs a control; windowMode gets a choice and masterVolume a range.",
      "touched": [
        "src/settings.constants.ts"
      ]
    },
    {
      "id": "brock-app-logo-src",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "BrockApp no longer takes logoSrc or instanceLogoSrc; the shell reads them from product.logos.",
      "touched": []
    },
    {
      "id": "custom-layer-rename",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "A full-bleed screen at the root of src/screens is now <id>.layer.tsx; .custom.tsx names a custom page inside a bucket. Each root .custom.tsx is renamed.",
      "touched": []
    },
    {
      "id": "gitignore-generated-files",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "Brock now writes the bot logos, the installer splash, the profile store and the port slot file; git ignores them.",
      "touched": [
        ".gitignore"
      ]
    },
    {
      "id": "hero-slots",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "A hero page fills the Tessera Hero slots (Title, Eyebrow, Backdrop, Art, Actions, Tools, Facts, Aside, Panel); Facts children and a heading inside Backdrop become to-dos.",
      "touched": []
    },
    {
      "id": "index-boot-splash",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "The app window has no loading screen of its own any more; the hand-written boot splash leaves src/index.html.",
      "touched": [
        "src/index.html"
      ]
    },
    {
      "id": "knip-custom-pages",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "knip treats custom pages as entries, since the build reads their searchEntries export instead of importing it.",
      "touched": []
    },
    {
      "id": "menu-built-in-about",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "The shell menu has its own About entry; an app entry for the About screen replaces it and loses its icon.",
      "touched": []
    },
    {
      "id": "removed-shell-exports",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "brock-react no longer exports the shell parts Tessera composites replaced; imports of them become to-dos.",
      "touched": []
    },
    {
      "id": "widget-layout-v2",
      "version": "0.1.1",
      "source": "@drizztdourden08/brock-build",
      "summary": "The widget host docks widgets around the main view on the Tessera split tree; code that patched widgets or read the flat layout becomes to-dos. Saved layouts migrate on load.",
      "touched": []
    },
    {
      "id": "badge-status",
      "version": "0.2.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "Tessera Badge is a count or a dot and the status word is Status; a Badge without a value and StatusBadge become to-dos.",
      "touched": []
    },
    {
      "id": "dropdown-menu-groups",
      "version": "0.2.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "Tessera DropdownMenu builds from MenuGroup[]; items, the Tessera MenuEntry type, toDropdownItems and OperatorSpec labels become to-dos.",
      "touched": []
    },
    {
      "id": "facts-panel-names",
      "version": "0.2.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "Hero draws its facts with FactsPanel: HeroFact and HeroFactRow become FactsPanelFact and FactsPanelGroup, and the .hero__fact classes and --hero-fact-max-w become the .facts-panel ones.",
      "touched": []
    },
    {
      "id": "progress-bar-tone",
      "version": "0.2.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "Tessera ProgressBar takes tone and secondaryTone in place of variant and secondaryVariant, and ProgressVariant is ProgressTone; each is renamed.",
      "touched": [
        "src/compounds/RunProgressPanel/RunProgressPanel.tsx"
      ]
    },
    {
      "id": "standards-lint-deps",
      "version": "0.2.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "brock-lint-config now sits on @drizztdourden08/standards, which carries typescript-eslint and eslint-plugin-react-hooks: an app drops them from devDependencies and its pnpm catalog, and knip ignores standards, whose stylelint plugins it sees through the lint config.",
      "touched": [
        "package.json"
      ]
    },
    {
      "id": "tessera-provider-overrides",
      "version": "0.2.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "TesseraProvider overrides carry the clipboard writer and the portal document; AboutPanel onCopy, AboutPanelCopy and PortalDocumentContext become to-dos.",
      "touched": []
    },
    {
      "id": "window-title-bar-config",
      "version": "0.2.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "Tessera WindowTitleBar builds its menu from MenuGroup[] and reports every button to onControl; the removed props become to-dos.",
      "touched": []
    },
    {
      "id": "design-package",
      "version": "0.2.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "tessera.config.json at the repo root; a monorepo gets packages/design for its shared parts, and each app compound moves there when every import of it can be rewritten.",
      "touched": [
        "../../packages/design/package.json",
        "../../packages/design/tsconfig.json",
        "../../packages/design/src/index.ts",
        "../../tessera.config.json",
        "../../knip.json",
        "src/views/GameStore/behavior/card-props.ts",
        "package.json",
        "src/views/GameStore/GameStore.tsx",
        "src/views/SessionDashboard/sub-components/HintsPanel/HintsPanel.tsx",
        "src/views/SessionDashboard/sub-components/LogWidget/LogWidget.tsx",
        "src/views/SessionDashboard/sub-components/SpoilerWidget/SpoilerWidget.tsx",
        "src/views/PresetEditor/PresetEditor.tsx",
        "src/views/SessionDashboard/sub-components/PlayersPanel/PlayersPanel.tsx",
        "src/views/PresetsHub/sub-components/PresetList/PresetList.tsx",
        "src/views/RunProgress/RunProgress.tsx",
        "src/views/SessionsLibrary/sub-components/HistoryCard/HistoryCard.tsx",
        "src/views/HostingSettings/HostingSettings.tsx",
        "src/views/SessionBuilder/SessionBuilder.tsx",
        "src/views/SessionDashboard/SessionDashboard.tsx",
        "src/views/HomeView/HomeView.tsx",
        "src/views/SessionDashboard/sub-components/SessionSummary/SessionSummary.tsx",
        "src/views/SessionsLibrary/sub-components/TemplatesCard/TemplatesCard.tsx",
        "../../packages/design/src/compounds/GameCard",
        "../../packages/design/src/compounds/HintRow",
        "../../packages/design/src/compounds/LogLines",
        "../../packages/design/src/compounds/OptionGroupTabs",
        "../../packages/design/src/compounds/PlayerStatusRow",
        "../../packages/design/src/compounds/PresetListItem",
        "../../packages/design/src/compounds/RunProgressPanel",
        "../../packages/design/src/compounds/RunRow",
        "../../packages/design/src/compounds/ServerOptionsForm",
        "../../packages/design/src/compounds/SessionStatusBar",
        "../../packages/design/src/compounds/StatCard",
        "../../packages/design/src/compounds/TemplateRow",
        "../../packages/design/src/index.ts",
        "../../packages/design/package.json"
      ]
    },
    {
      "id": "brock-compounds",
      "version": "0.4.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "AboutPanel, ReleaseNotesPanel and CalibrationPanel are Brock compounds now: their imports move from @drizztdourden08/tessera to @drizztdourden08/brock-react (AboutPanel, ReleaseNotesPanel) and @drizztdourden08/brock-input/renderer (CalibrationPanel, which needs the input module). ProfilePicker becomes a to-do pointing to ProfilesPanel in brock-react.",
      "touched": []
    },
    {
      "id": "gitignore-title-bar-logos",
      "version": "0.7.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "brock icons now also writes public/logos/icon-32.png, the title bar logo, and icon-24.png; git ignores them beside icon-256.png.",
      "touched": []
    },
    {
      "id": "title-bar-actions",
      "version": "0.7.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "RendererModule.titleBar slots become titleBarActions: the updater badge becomes its useUpdateAction hook, the search and bug report buttons are standard actions and drop out, and any other slot is a to-do naming the WindowTitleBarAction API.",
      "touched": []
    },
    {
      "id": "tessera-renames",
      "version": "0.4.0",
      "source": "@drizztdourden08/tessera",
      "summary": "Tessera renamed custom properties, components, classes, props and prop values, and removed exports; RENAMES.json replays over the app code, and each note becomes a to-do.",
      "touched": [
        "../../packages/design/src/compounds/LogLines/LogLines.tsx",
        "../../packages/design/src/compounds/OptionGroupTabs/OptionGroupTabs.tsx"
      ]
    },
    {
      "id": "tessera-renames",
      "version": "0.5.0",
      "source": "@drizztdourden08/tessera",
      "summary": "Tessera renamed custom properties, components, classes, props and prop values, and removed exports; RENAMES.json replays over the app code, and each note becomes a to-do.",
      "touched": []
    },
    {
      "id": "tessera-renames",
      "version": "0.6.0",
      "source": "@drizztdourden08/tessera",
      "summary": "Tessera renamed custom properties, components, classes, props and prop values, and removed exports; RENAMES.json replays over the app code, and each note becomes a to-do.",
      "touched": []
    },
    {
      "id": "tessera-renames",
      "version": "0.7.0",
      "source": "@drizztdourden08/tessera",
      "summary": "Tessera renamed custom properties, components, classes, props and prop values, and removed exports; RENAMES.json replays over the app code, and each note becomes a to-do.",
      "touched": []
    },
    {
      "id": "tessera-renames",
      "version": "0.8.0",
      "source": "@drizztdourden08/tessera",
      "summary": "Tessera renamed custom properties, components, classes, props and prop values, and removed exports; RENAMES.json replays over the app code, and each note becomes a to-do.",
      "touched": []
    }
  ],
  "todos": [
    {
      "number": 1,
      "migration": "design-package",
      "file": "src/compounds/OptionField",
      "line": null,
      "message": "OptionField stays in apps/desktop/src/compounds: apps/desktop/tests/presets/preset-list.keep.test.ts:4 imports ../../src/compounds/OptionField/behavior/description-preview past its index.ts. Clear that and run brock migrate again, or move it to packages/design/src/compounds by hand and import it from @archipelia/design."
    },
    {
      "number": 2,
      "migration": "design-package",
      "file": "src/compounds/PlayerRow",
      "line": null,
      "message": "PlayerRow stays in apps/desktop/src/compounds: apps/desktop/tests/sessions/option-label.keep.test.ts:3 imports ../../src/compounds/PlayerRow/behavior/option-label past its index.ts. Clear that and run brock migrate again, or move it to packages/design/src/compounds by hand and import it from @archipelia/design."
    },
    {
      "number": 3,
      "migration": "design-package",
      "file": "src/option-fields/OptionControl",
      "line": null,
      "message": "OptionControl sits outside the parts folders of tessera.config.json. Move it to packages/design/src/compounds when more than one view uses it, or under the view that owns it in src/views."
    },
    {
      "number": 4,
      "migration": "design-package",
      "file": "src/option-fields/OptionFieldRow",
      "line": null,
      "message": "OptionFieldRow sits outside the parts folders of tessera.config.json. Move it to packages/design/src/compounds when more than one view uses it, or under the view that owns it in src/views."
    },
    {
      "number": 5,
      "migration": "design-package",
      "file": "src/settings-tabs/EngineTab.tsx",
      "line": null,
      "message": "EngineTab sits outside the parts folders of tessera.config.json. Move it to packages/design/src/compounds when more than one view uses it, or under the view that owns it in src/views."
    },
    {
      "number": 6,
      "migration": "design-package",
      "file": "src/settings-tabs/GgTab.tsx",
      "line": null,
      "message": "GgTab sits outside the parts folders of tessera.config.json. Move it to packages/design/src/compounds when more than one view uses it, or under the view that owns it in src/views."
    },
    {
      "number": 7,
      "migration": "design-package",
      "file": "src/settings-tabs/HostingTab.tsx",
      "line": null,
      "message": "HostingTab sits outside the parts folders of tessera.config.json. Move it to packages/design/src/compounds when more than one view uses it, or under the view that owns it in src/views."
    },
    {
      "number": 8,
      "migration": "design-package",
      "file": "../../package.json",
      "line": null,
      "message": "run pnpm install at the repo root so @archipelia/design links into the packages that import it."
    }
  ],
  "tessera": {
    "warnings": [],
    "skipped": null,
    "pinned": "0.9.1",
    "range": {
      "from": "0.3.0",
      "to": "0.9.1",
      "next": false
    }
  }
}
