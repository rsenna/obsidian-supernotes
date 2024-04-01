import {DeleteOptions, SupernotesPluginSettings, SyncOptions} from "./settings"
import {createNoteForEntry, getAllNotesInFolder, getNoteInFolder} from "./note"
import {App, moment, normalizePath, Notice, requestUrl, RequestUrlParam, RequestUrlResponse, TFile} from "obsidian"
import {formatDate, getEnumValues, isObject, isValidDateString} from "./utils"
import {SupernotesCard, SupernotesStatus} from "./types"

const getDownloadRequestUrlParamsBody = (includeJunk: boolean): string => {
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

const getDeleteRequestUrlParamsBody = (cardIds: string[]): string => {
  const query: string[] = []

  query.push('[')
  query.push(cardIds.map(it => `"${it}"`).join(','))
  query.push(']')

  return query.join('')
}

const getDisableRequestUrlParamsBody = (cardIds: string[]): string => {
  const query: string[] = []

  query.push('{')
  query.push(cardIds.map(it => `"${it}": {"membership": {"status": -2}}`).join(',\n'))
  query.push('}')

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

  const downloadRequestUrlParams: RequestUrlParam = {
    url: 'https://api.supernotes.app/v1/cards/get/select',
    method: 'POST',
    headers: {
      'Api-Key': settings.basic.apiKey,
      'Content-Type': 'application/json'
    },
    body: getDownloadRequestUrlParamsBody(settings.junk.enabled)
  }

  const deleteRequestUrlParams = (cardIds: string[]): RequestUrlParam => {
    return {
      url: 'https://api.supernotes.app/v1/cards/delete',
      method: 'POST',
      headers: {
        'Api-Key': settings.basic.apiKey,
        'Content-Type': 'application/json'
      },
      body: getDeleteRequestUrlParamsBody(cardIds)
    }
  }

  const disableRequestUrlParams = (cardIds: string[]): RequestUrlParam => {
    return {
      url: 'https://api.supernotes.app/v1/cards',
      method: 'PATCH',
      headers: {
        'Api-Key': settings.basic.apiKey,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: getDisableRequestUrlParamsBody(cardIds)
    }
  }

  const getExistingNoteMtime = async (file: TFile) => {
    if (!file) {
      console.warn(`getExistingNoteMtime: Cannot not load "updated" field from a null file".`)
      return 0
    }

    let result: any = undefined
    try {
      await app.fileManager.processFrontMatter(file, f => result = f['updated'])
    } catch (ex) {
      console.error(`getExistingNoteMtime error: ${ex}.`)
      return 0
    }

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

  const shouldDownloadFile = async (responseEntry: SupernotesCard): Promise<[boolean, TFile?]> => {
    const existingNoteFile = await getNoteInFolder(app, settings, responseEntry)

    if (!existingNoteFile) {
      return [true, undefined]
    }

    const existingUnixTime = await getExistingNoteMtime(existingNoteFile)
    const responseUnixTime = moment(responseEntry.data.modified_when).unix()

    const download =
      !existingNoteFile ||
      (settings.syncRules.download === SyncOptions.Always) ||
      (settings.syncRules.download === SyncOptions.ByTimestamp && responseUnixTime > existingUnixTime)

    return [download, existingNoteFile]
  }

  let downloadEntryCount = 0
  let deletedCount = 0

  try {
    const downloadResponse: RequestUrlResponse = await requestUrl(downloadRequestUrlParams)

    if (downloadResponse.status != 200) {
      console.error(`Error (${downloadResponse.status}): ${downloadResponse.text}.`)
      new Notice('Error downloading Supernotes cards. See development console for details.')
      return;
    }

    const downloadResponseJson = downloadResponse.json
    const downloadResponseCards: SupernotesCard[] = Object.values(downloadResponseJson)

    downloadEntryCount = downloadResponseCards.length

    const downloadedCards: string[] = []

    for (const downloadResponseEntry of downloadResponseCards) {
      const [download, existingNoteFile] = await shouldDownloadFile(downloadResponseEntry)

      // Create note from supernotes card:
      if (download) {
        const noteFile = existingNoteFile || await createNoteForEntry(app, settings, downloadResponseEntry)

        await app.fileManager.processFrontMatter(noteFile, frontmatter => {
          setFrontmatter(basePrefix, downloadResponseEntry, frontmatter)

          frontmatter['created'] = formatDate(downloadResponseEntry.data.created_when)
          frontmatter['updated'] = formatDate(downloadResponseEntry.data.modified_when)
        })

        await app.vault.append(noteFile, downloadResponseEntry.data.html)

        downloadedCards.push(downloadResponseEntry.data.id)
      }
    }

    const deleteSupernotesCards = async (cardIds: string[]) => {
      const deleteRequest = deleteRequestUrlParams(cardIds)
      const deleteResponse: RequestUrlResponse = await requestUrl(deleteRequest)

      if (deleteResponse.status != 207) {
        console.error(`Error (${deleteResponse.status}): ${deleteResponse.text}.`)
        new Notice('Error deleting remote Supernotes cards. See development console for details.')
        return;
      }

      deletedCount = downloadedCards.length
    }

    const disableSupernotesCards = async (cardIds: string[]) => {
      const disableRequest = disableRequestUrlParams(cardIds)
      const disableResponse: RequestUrlResponse = await requestUrl(disableRequest)

      if (disableResponse.status != 207) {
        console.error(`Error (${disableResponse.status}): ${disableResponse.text}.`)
        new Notice('Error disabling remote Supernotes cards. See development console for details.')
        return;
      }

      deletedCount = downloadedCards.length
    }

    // Delete supernotes cards:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deleteDownloadedSupernotesCards = async () => {
      if (settings.syncRules.delete === DeleteOptions.Remote && downloadedCards.length > 0) {
        await deleteSupernotesCards(downloadedCards)
      }
    }

    // Delete supernotes cards, one by one:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deleteDownloadedSupernotesCards1By1 = async () => {
      if (settings.syncRules.delete === DeleteOptions.Remote) {
        for (const cardId of downloadedCards) {
          await deleteSupernotesCards([cardId])
        }
      }
    }

    // Delete supernotes cards, one by one:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const disableDownloadedSupernotesCards = async () => {
      if (settings.syncRules.delete === DeleteOptions.Remote) {
        await disableSupernotesCards(downloadedCards)
      }
    }

    // Delete supernotes cards, one by one:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const disableDownloadedSupernotesCards1By1 = async () => {
      if (settings.syncRules.delete === DeleteOptions.Remote) {
        for (const cardId of downloadedCards) {
          await disableSupernotesCards([cardId])
        }
      }
    }

    await disableDownloadedSupernotesCards()
    await deleteDownloadedSupernotesCards()

  } catch (ex) {
    console.error('ERROR ' + ex)
    new Notice('An unknown error happened during download of Supernotes cards. See development console for details.')
  } finally {
    statusBarEl.setText(`Download complete. ${downloadEntryCount} card(s) downloaded, ${deletedCount} card(s) deleted from Supernotes.`)
  }
}

export const uploadAll = async (
  app: App,
  settings: SupernotesPluginSettings,
  _statusBarItem: HTMLElement,
  _ignore: number[]
) => {
  const folderPath = normalizePath(settings.basic.folder)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _file of getAllNotesInFolder(app, folderPath)) {
    // TODO
  }
}

// TODO: synchronizeAll is currently not being used
export const synchronizeAll = async (
  app: App,
  settings: SupernotesPluginSettings,
  statusBarItem: HTMLElement
) => {
  await downloadAll(app, settings, statusBarItem)
  await uploadAll(app, settings, statusBarItem, [])
}
