---
tags:
  - type/note
  - locale/en/gb
  - status/wip
aliases: 
created: 2023-12-25T16:52:20+01:00
updated: 2023-12-28T18:27:08+01:00
---

## Backlog

- [/] Settings
    - [/] String: API Key
        - [ ] Show if it works to the user
    - [/] Folder: Supernotes
        - [X] Default: 'supernotes' ✅ 2023-12-27
        - [ ] Use smart path completion (suggesters)
    - [ ] Checkbox: Download Junk
        - [ ] Default: true
    - [ ] Folder: Junk
        - [ ] Only show if 'Download Junk' is true
        - [ ] Default: 'junk'
        - [ ] Use smart path completion (suggesters)
    - [ ] Checkbox: Note Title same as Supernotes
        - [ ] When on: note title == `sn-data-name`
            - When `sn-data-name` is set
    - [ ] Dropdown: Delete remote notes when downloading
        - [ ] Options: Yes, No, Ask
    - [ ] Dropdown: Delete local notes when uploading
        - [ ] Options: Yes, No, Ask
    - [ ] String: Timezone
        - Why: Supernotes does not seem to provide timezone (UTC offset)
        - [ ] Validation: either 'Z', '+hh:mm', '-hh:mm', or ''
            - If empty, no timezone designator will be added nor considered
- [/] Download notes
    - [X] Setting: API Key ✅ 2023-12-27
    - [X] Setting: Folder: Supernotes ✅ 2023-12-27
    - [/] Command: Download all notes
        - [x] Currently: downloading all notes, regardless of status, title = id ✅ 2023-12-28
    - [X] #bugfix Do *not* open tabs when downloading notes ✅ 2023-12-27
    - [-] Pagination
        - Seems to be working fine without it, for now
    - [X] Use status bar to show down when download starts & ends ✅ 2023-12-27
    - [/] Types
        - [-] Escape and use quotes around strings ✅ 2023-12-28
            - Does not seem to be really needed
        - [/] Convert dates to valid local format
            - [X] Initially hardcoded UTC offset == +01:00 (Madrid)
            - [ ] Support setting String: Timezone
    - [ ] Setting: Separate notes per status (junk x not junk)
    - [ ] Setting: use title as id (when available)
        - [ ] Make sure to not overwrite notes locally with the same title!
    - [ ] Setting: Delete remote
    - [ ] Convert remote HTML to local markdown
        - Obsidian *probably* has a function for that...
    - [ ] Command: Download **current** note
        - Only works if a sn note containing `sn-data-id` is currently opened
            - Otherwise error
        - Makes less sense if 'Delete remote' is enabled, but execute delete anyway
    - [ ] #define What about overwriting local with notes already downloaded?
    - [ ] #define Journal?
- [ ] Upload notes
    - [ ] Setting: API Key
    - [ ] Setting: Folder: Supernotes
    - [ ] Pagination
    - [ ] Use status bar to show down when download starts & ends
    - [ ] Types
        - [ ] Convert dates to valid remote format
        - [ ] Unescape strings
    - [ ] Setting: Separate notes per status (junk x not junk)
    - [ ] Setting: use title as id (when available)
        - [ ] Make sure to not overwrite notes remotely with the same title!
    - [ ] Setting: Delete remote
    - [ ] Convert remote HTML from local markdown
        - Obsidian *probably* has a function for that...
    - [ ] #define What about overwriting remote?
    - [ ] #define Journal?
- [ ] Sync Notes
    - Will be easier to implement once download and upload are feature complete
    - [ ] Won't execute if either 'Delete' setting is set to != No
        - [ ] Show Notice
    - [ ] #define Update `data.sinced_when` field?

## Current Objective

- [/] Download all notes from Supernotes

## References
<!-- Links to pages not referenced in the content -->
- 
