import {SupernotesPluginSettings} from "./settings";
import {createNoteInFolder} from "./create-note";
import {App, Notice, requestUrl, RequestUrlParam, RequestUrlResponse} from "obsidian";

export const downloadAll = async (app: App, settings: SupernotesPluginSettings) => {
  const requestUrlParams: RequestUrlParam = {
    url: 'https://api.supernotes.app/v1/cards/get/select',
    method: 'POST',
    headers: {
      'Api-Key': 'VSPTEr4dPN7LSH2PpkTf4aN7ujksb-4ovKKT6bqNzKs',
      'Content-Type': 'application/json'
    },
    body: '{"limit":10,"sort_type":2}'
  }

  const response: RequestUrlResponse = await requestUrl(requestUrlParams)

  if (response.status != 200) {
    new Notice(`Error (${response.status}): ${response.text}.`)
    return;
  }

  console.log(response.json)

  const responseJson = response.json
  const entries: any[] = Object.values(responseJson)

  // Avoiding nested yaml properties because of
  // https://forum.obsidian.md/t/properties-support-multi-level-yaml-nested-attributes/63826

  const basePrefix = 'sn'
  const separator = '-'
  const snDataMarkup = 'sn-data-markup';
  const snDataHtml = 'sn-data-html';
  const ignoredKeys = [snDataMarkup, snDataHtml]

  const setFrontmatter = (prefix: string, entry: any, frontmatter: any) => {
    for (const key in entry) {
      const item = entry[key]
      const prefixedKey = prefix + separator + key

      if (ignoredKeys.contains(prefixedKey)) {
        continue;
      }

      if (typeof item === 'object') {
        setFrontmatter(prefixedKey, item, frontmatter)
      } else {
        frontmatter[prefixedKey] = item
      }
    }
  }

  for (const entry of entries) {
    console.log('id', entry.data.id)
    console.log('data', entry.data)

    const noteFile = await createNoteInFolder(app, settings, entry.data.id)
    await app.fileManager.processFrontMatter(noteFile, frontmatter => {
      setFrontmatter(basePrefix, entry, frontmatter)
    })

    await app.vault.append(noteFile, entry.data.html)
  }
}

// for (const dataKey in data) {
//   frontmatter[`sn-data-${dataKey}`] = data[dataKey]
// }

// 'backlinks'
// 'data'
//   'color'
//   'comment_count'
//   'created_when'
//   'html'
//   'icon'
//   'id'
//   'likes'
//   'markup'
//   'member_count'
//   'meta'
//   'modified_by_id'
//   'modified_when'
//   'name'
//   'owner_id'
//   'public_child_count'
//   'synced_when'
//   'tags'
//   'targeted_when'
//   'ydoc'
//
// 'membership'
//   'auto_publish_children'
//   'created_when'
//   'enrolled_when'
//   'id'
//   'liked'
//   'modified_when'
//   'opened_when'
//   'perms'
//   'personal_color'
//   'personal_tags'
//   'status'
//   'total_child_count'
//   'via_id'
//   'via_type'
//   'view'
//     'display_type'
//     'sort_ascending'
//     'sort_type'
//   },
//   'visibility'
//
// 'parents'

