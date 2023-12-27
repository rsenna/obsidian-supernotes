---
tags:
  - type/note
  - locale/en/gb
  - status/wip
aliases: 
created: 2023-12-25T16:52:20+01:00
updated: 2023-12-27T12:53:59+01:00
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
    - [ ] Pagination
    - [ ] Setting: Separate notes per status (junk x not junk)
    - [ ] Setting: use title as id (when available)
        - [ ] Make sure to not overwrite notes locally with the same title!
    - [ ] Setting: Delete remote
    - [ ] What about overwriting local with notes already downloaded?
    - [ ] Journal?
- [ ] Upload notes
    - [ ] Setting: API Key
    - [ ] Setting: Folder: Supernotes
    - [ ] Pagination
    - [ ] Setting: Separate notes per status (junk x not junk)
    - [ ] Setting: use title as id (when available)
        - [ ] Make sure to not overwrite notes remotely with the same title!
    - [ ] Setting: Delete remote
    - [ ] What about overwriting remote?
    - [ ] Journal?
- [ ] Sync Notes
    - Will be easy to implement once download and upload are feature complete
    - [ ] Won't execute if either 'Delete' setting is set to != No, show Notice

## Current dev objective

- [ ] Download all notes from Supernotes

## References
<!-- Links to pages not referenced in the content -->
- 
