# Supernotes

## Purpose

Anything alias related

## Functionality

- Given a Current Link composed of Text and Address
- Provide commands to
    - Remove Link Text
    - Remove Link Address
    - UPDATE a broken alias Address by finding document
      WHERE Name OR at least 1 Alias
      EQUAL TO Current Link Text OR Address
        - If link is not broken, beep and don't fix it
            - Another command to always replace it?
        - If more than one document is found, let user choose
        - If no document is found, allow
            - Create new note, OR
            - Find a pre-existing note, and link to it instead
                - Ask to add alias from link, if it is not already present at the note
        - Options: current alias, current page, current directory and subdirectories
            - Settings for defaults when mass updating links
    - List all links and their aliases
        - Can add new aliases from this page
        - Can remove aliases from this page
        - Can rename aliases from this page
        - Can move link(s) to another page, keeping alias or not
        - Realias links - move links to another alias
            - Can use one of the already recorded alias, or a new one
        - Only Existing Files, Only Non-Existing Files, Both
    - Find links with same aliases
        - Can add new aliases from this page
        - Can remove aliases from this page
        - Can rename aliases from this page
        - Can move link(s) to another page, keeping alias or not
        - Only Existing Files, Only Non-Existing Files, Both
    - Edit link
        - Show modal with Link Text and Address
        - Option to invert Text and Address
        - Autocomplete on Address
