import {SupernotesPluginSettings} from "./settings";
import {createNoteForEntry, getNoteInFolder} from "./note";
import {App, Notice, requestUrl, RequestUrlParam, RequestUrlResponse} from "obsidian";
import {asDate, formatDate, getEnumValues, isAnyOf, isObject, isValidDateString} from "./utils";
import {DownloadConflict, DownloadConflictResult} from "./modals/DownloadConflict";
import {Entry, SupernotesStatus} from "./types";

const getRequestUrlParamsBody = (includeJunk: boolean) => {
  const query: string[] = []

  query.push('{')
  query.push('"sort_type":2,')
  query.push('"include_membership_statuses": [')
  query.push(
    getEnumValues(SupernotesStatus)
      .filter(it => includeJunk || it !== SupernotesStatus.JUNKED)
      .filter(it => it)
      .join(','))
  query.push(']}')

  console.log(query)

  return query.join('')
}

export const downloadAll = async (
  app: App,
  settings: SupernotesPluginSettings,
  statusBarItem: HTMLElement
) => {

  statusBarItem.setText('Download started...')

  const requestUrlParams: RequestUrlParam = {
    url: 'https://api.supernotes.app/v1/cards/get/select',
    method: 'POST',
    headers: {
      'Api-Key': settings.apiKey,
      'Content-Type': 'application/json'
    },
    body: getRequestUrlParamsBody(settings.isJunkEnabled)
  }

  let entryCount = 0

  try {
    const response: RequestUrlResponse = await requestUrl(requestUrlParams)

    if (response.status != 200) {
      new Notice(`Error (${response.status}): ${response.text}.`)
      return;
    }

    console.debug('response.status', response.status)

    const responseJson = response.json
    const entries: Entry[] = Object.values(responseJson)

    console.debug('entries.length', entries.length)
    entryCount = entries.length

    // Avoiding nested yaml properties because of
    // https://forum.obsidian.md/t/properties-support-multi-level-yaml-nested-attributes/63826

    const basePrefix = 'sn'
    const separator = '-'
    const snDataMarkup = 'sn-data-markup';
    const snDataHtml = 'sn-data-html';
    // const snDataCreatedWhen = 'sn-data-created_when'
    // const snDataModifiedWhen = 'sn-data-modified_when'
    const ignoredKeys = [snDataMarkup, snDataHtml]

    const setFrontmatter = (prefix: string, entry: Entry, frontmatter: any) => {
      for (const key in entry) {
        // @ts-ignore
        const item = entry[key]
        const prefixedKey = prefix + separator + key

        if (ignoredKeys.contains(prefixedKey)) {
          continue;
        }

        if (isObject(item)) {
          setFrontmatter(prefixedKey, item, frontmatter)
        } else if (isValidDateString(item)) {
          frontmatter[prefixedKey] = formatDate(item)
        } else {
          frontmatter[prefixedKey] = item
        }
      }
    }

    let action: DownloadConflictResult | null = null

    for (const entry of entries) {
      const existingNoteFile = await getNoteInFolder(app, settings, entry)

      if (!action && existingNoteFile) {
        await app.fileManager.processFrontMatter(existingNoteFile, frontmatter => {
          const modal = new DownloadConflict(app, {
            filename: existingNoteFile.path,
            localCreatedTimestamp: frontmatter['created'],
            remoteCreatedTimestamp: asDate(entry.data.created_when),
            localUpdatedTimestamp: frontmatter['updated'],
            remoteUpdatedTimestamp: asDate(entry.data.modified_when)
          })
          modal.open()
          action = modal.result
        })
      }

      if (isAnyOf(action, null, DownloadConflictResult.Overwrite, DownloadConflictResult.OverwriteAll)) {
        const noteFile = await createNoteForEntry(app, settings, entry)

        await app.fileManager.processFrontMatter(noteFile, frontmatter => {
          setFrontmatter(basePrefix, entry, frontmatter)

          frontmatter['created'] = formatDate(entry.data.created_when)
          frontmatter['updated'] = formatDate(entry.data.modified_when)
        })

        await app.vault.append(noteFile, entry.data.html)
      }

      // Ignore and Overwrite only valid for current file:
      if (isAnyOf(action, DownloadConflictResult.Ignore, DownloadConflictResult.Overwrite)) {
        action = null
      }
    }
  } catch (ex) {
    console.error('ERROR ' + ex)
    new Notice(ex)
  } finally {
    statusBarItem.setText(`Download complete (total = ${entryCount}).`)
  }
}
