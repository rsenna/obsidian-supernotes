---
tags:
  - type/note
  - locale/en/gb
  - status/wip
aliases: 
created: 2023-12-25T16:52:20+01:00
updated: 2023-12-27T13:40:56+01:00
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
- [/] Download notes
    - [X] Setting: API Key ✅ 2023-12-27
    - [X] Setting: Folder: Supernotes ✅ 2023-12-27
    - [X] Currently: downloading 10 notes, regardless of status, title = id ✅ 2023-12-27
    - [X] #bugfix Do *not* open tabs when downloading notes ✅ 2023-12-27
    - [-] Pagination
        - Seems to be working fine without it, for now
    - [X] Use status bar to show down when download starts & ends ✅ 2023-12-27
    - [ ] Types
        - [ ] Convert dates to valid local format
        - [ ] Escape and use quotes around strings
    - [ ] Setting: Separate notes per status (junk x not junk)
    - [ ] Setting: use title as id (when available)
        - [ ] Make sure to not overwrite notes locally with the same title!
    - [ ] Setting: Delete remote
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
