{
  "applied": [
    {
      "id": "screen-icons",
      "version": "0.10.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "Every screen needs an icon now, for the page header Brock draws under the window header: a defineScreen or defineHub call without one becomes a to-do.",
      "touched": []
    },
    {
      "id": "settings-row-hints",
      "version": "0.10.0",
      "source": "@drizztdourden08/brock-build",
      "summary": "Every settings row now needs a hint and a description, or noDescription: true. A row create-brock scaffolded gets the template hint; every other row without them, in a .settings.ts page, a settings tab or a Tessera SettingsSection, becomes a to-do naming the missing fields.",
      "touched": []
    },
    {
      "id": "tessera-renames",
      "version": "0.10.0",
      "source": "@drizztdourden08/tessera",
      "summary": "Tessera renamed custom properties, components, classes, props, prop values and config keys, and removed exports; RENAMES.json replays over the app code and its JSON settings, and each note becomes a to-do.",
      "touched": []
    }
  ],
  "todos": [
    {
      "number": 1,
      "migration": "screen-icons",
      "file": "src/navigation/SessionScreen.tsx",
      "line": 12,
      "message": "Brock 0.10.0 gives every screen an icon and a title: defineScreen now needs icon, the glowing mark of the page header that a fullscreen screen draws under its window header. Add icon, such as <Icon name=\"layers\" />. A screen whose content draws its own headers, like a hub, sets header: 'own'."
    }
  ],
  "tessera": {
    "warnings": [],
    "skipped": null,
    "pinned": "0.10.0",
    "range": {
      "from": "0.9.0",
      "to": "0.10.0",
      "next": false
    }
  }
}
