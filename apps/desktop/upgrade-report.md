{
  "applied": [
    {
      "id": "brock-palette",
      "version": "0.11.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "The starter theme takes the Brock palette (orange, charcoal and greys, matching the Brock logo) in place of the old blue; only a src/theme.css still holding the untouched old starter seeds is rewritten.",
      "touched": []
    },
    {
      "id": "widget-files",
      "version": "0.11.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "Widgets by convention: src/widgets/<id>.widget.tsx files are listed by brock sync in .brock/widgets.ts. src/main.tsx gets widgets={appWidgets} on BrockApp and the import beside the other .brock imports. Widgets defined by hand (defineWidget, registerWidgets, a widgets prop) become to-dos naming their new file; they are not moved, because a hand-written definition can close over app state a file of its own would lose.",
      "touched": [
        "src/main.tsx"
      ]
    }
  ],
  "todos": [
    {
      "number": 1,
      "migration": "widget-files",
      "file": "src/main.tsx",
      "line": 22,
      "message": "Widgets now live in src/widgets/<id>.widget.tsx: the default export is the component, `meta` holds label, icon, popOut, devOnly, defaultVisibility ('context-only'), defaultSide and the default sizes. brock sync lists them in .brock/widgets.ts, which src/main.tsx hands to BrockApp as widgets. registerWidgets hands Brock widgets defined by hand: once each one is a file in src/widgets, remove this call."
    },
    {
      "number": 2,
      "migration": "widget-files",
      "file": "src/widgets/session-widget.ts",
      "line": 8,
      "message": "Widgets now live in src/widgets/<id>.widget.tsx: the default export is the component, `meta` holds label, icon, popOut, devOnly, defaultVisibility ('context-only'), defaultSide and the default sizes. brock sync lists them in .brock/widgets.ts, which src/main.tsx hands to BrockApp as widgets. This widget is defined by hand: move it to src/widgets/<id>.widget.tsx and drop the definition. A widget a module ships stays in its module."
    }
  ],
  "tessera": {
    "warnings": [],
    "skipped": null,
    "pinned": null,
    "range": {
      "from": "0.10.0",
      "to": "0.10.0",
      "next": false
    }
  }
}
