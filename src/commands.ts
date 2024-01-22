import {SupernotesPluginSettings, SyncOptions} from "./settings";
import {createNoteForEntry, getNoteInFolder} from "./note";
import {App, moment, Notice, requestUrl, RequestUrlParam, RequestUrlResponse, TFile} from "obsidian";
import {formatDate, getEnumValues, isObject, isValidDateString} from "./utils";
import {SupernotesCard, SupernotesStatus} from "./types";

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

  return query.join('')
}

export const downloadAll = async (
  app: App,
  settings: SupernotesPluginSettings,
  statusBarEl: HTMLElement
) => {
  statusBarEl.setText('Download started...')

  const basePrefix = 'sn'
  const separator = '-'
  const snDataMarkup = 'sn-data-markup';
  const snDataHtml = 'sn-data-html';
  const ignoredKeys = [snDataMarkup, snDataHtml]

  const requestUrlParams: RequestUrlParam = {
    url: 'https://api.supernotes.app/v1/cards/get/select',
    method: 'POST',
    headers: {
      'Api-Key': settings.basic.apiKey,
      'Content-Type': 'application/json'
    },
    body: getRequestUrlParamsBody(settings.junk.enabled)
  }

  const getExistingNoteMtime = async (file: TFile) => {
    let result: any
    await app.fileManager.processFrontMatter(file, f => result = f['updated'])
    return moment(result).unix()
  }

  const setFrontmatter = (prefix: string, card: SupernotesCard, frontmatter: any) => {
    // Avoiding nested yaml properties because of
    // https://forum.obsidian.md/t/properties-support-multi-level-yaml-nested-attributes/63826

    for (const key in card) {
      // @ts-ignore
      const item = card[key]
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

  let entryCount = 0

  try {
    const response: RequestUrlResponse = await requestUrl(requestUrlParams)

    if (response.status != 200) {
      new Notice(`Error (${response.status}): ${response.text}.`)
      return;
    }

    console.debug('response.status', response.status)

    const responseJson = response.json
    const responseCards: SupernotesCard[] = Object.values(responseJson)

    console.debug('responseCards.length', responseCards.length)
    entryCount = responseCards.length

    for (const responseEntry of responseCards) {
      const existingNoteFile = await getNoteInFolder(app, settings, responseEntry)
      const existingUnixTime = await getExistingNoteMtime(existingNoteFile)
      const responseUnixTime = moment(responseEntry.data.modified_when).unix()

      const download =
        !existingNoteFile ||
        (settings.syncRules.download === SyncOptions.Always) ||
        (settings.syncRules.download === SyncOptions.ByTimestamp && responseUnixTime > existingUnixTime)

      if (download) {
        const noteFile = existingNoteFile || await createNoteForEntry(app, settings, responseEntry)

        await app.fileManager.processFrontMatter(noteFile, frontmatter => {
          setFrontmatter(basePrefix, responseEntry, frontmatter)

          frontmatter['created'] = formatDate(responseEntry.data.created_when)
          frontmatter['updated'] = formatDate(responseEntry.data.modified_when)
        })

        await app.vault.append(noteFile, responseEntry.data.html)
      }
    }
  } catch (ex) {
    console.error('ERROR ' + ex)
    new Notice(ex)
  } finally {
    statusBarEl.setText(`Download complete (total = ${entryCount}).`)
  }
}

export const uploadAll = async (
  app: App,
  settings: SupernotesPluginSettings,
  statusBarItem: HTMLElement,
  ignore: number[]
) => {
  // TODO
}

export const synchronizeAll = async (
  app: App,
  settings: SupernotesPluginSettings,
  statusBarItem: HTMLElement
) => {
  await downloadAll(app, settings, statusBarItem)
  await uploadAll(app, settings, statusBarItem, [])
}
