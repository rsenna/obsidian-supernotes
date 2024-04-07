# Obsidian Supernotes

Use [Supernotes](https://supernotes.app/) as a captures system for fleeting ideas or other types of quick notes, and
later import them into [Obsidian](https://obsidian.md).

## What is Supernotes?

[Supernotes](https://supernotes.app/) is a cloud-based, freemium, note-taking tool. Its basic features overlap in some
degree with [Obsidian](https://obsidian.md): it allows one to add notes with both tags and links to other notes. It also
supports daily notes, todo lists, and interactive graphs, just to mention some features it shares with Obsidian. It is
available through [the web](https://my.supernotes.app), and also in the iOS and Android App Stores.

## Why Obsidian Supernotes?

In principle one could implement a whole note-taking system (such as the [Zettelkästen Method](https://zettelkasten.de/overview/))
by using *either* Supernotes or Obsidian, alone.

There are some limitations on both tools, though, that limit the scope and/or the ease of usage of such approaches.

---

#### Obsidian Pros

- Free *
- Support templates, scripts
- Highly customizable through plugins

#### Obsidian Cons

- Not available in the web (even though one can publish notes to the web, the full Obsidian experience is still pretty 
  much offline)
- UX is focused on desktop platforms
- Mobile experience currently is possible, but lacking in many ways, such as speed and plugin availability
  - In my experience, even a *read only* vault can be quite hard to setup and use in mobile platforms...
- Does not easily allow collaboration between individuals or group members (even when paying for an
  [Obsidian plan](https://obsidian.md/pricing))

#### Supernotes Pros

- Free †
- Mobile centric
- Provides a fully working web interface at https://my.supernotes.app
- Provides desktop apps for Linux, Windows and macOS
- Quick and easy to use

#### Supernotes Cons

- Customisation is quite limited
- No support to plugins or templates
- Using the free plan, there is a basic limit of just 100 active notes

&ast; For personal use<br/>
† Limited access; monthly fee for unlimited note cards

---

But **by combining both tools** it's possible to have a better workflow, focused on what each tool currently does best:
- Use Supernotes for quick entering notes, and/or sharing notes with other individuals
- Use Obsidian for your full personal vault

## How

1. Register into Supernotes
2. Obtain a Supernotes API key
3. Install *Obsidian Supernotes* at your Obsidian vault
4. Go to the plugin's configuration window, and fill out information such as the Supernotes API key and the folder to
   be used for the synchronization process
5. Use command XXX to download your notes from Supernotes into your Obsidian vault

## Current Status

*Obsidian Supernotes* currently only supports *downloading* cards from Supernotes into your Obsidian vault.

Full blown synchronisation between Supernotes and Obsidian is not available (yet), but it is entirely possible.

I will consider investing more time in this plugin, if other people become interested in it. For now, only the basic
features described above are available.
