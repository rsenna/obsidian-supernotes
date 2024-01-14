import {App, Modal} from "obsidian";
import {formatDate} from "../utils";

export enum DownloadConflictResult {
  Ignore,
  IgnoreAll,
  Overwrite,
  OverwriteAll
}

export interface IDownloadConflictParams {
  filename: string,
  localCreatedTimestamp?: Date,
  remoteCreatedTimestamp?: Date,
  localUpdatedTimestamp?: Date,
  remoteUpdatedTimestamp?: Date
}

export class DownloadConflict extends Modal {
  private _result: DownloadConflictResult | null = null

  constructor(app: App, params: IDownloadConflictParams) {
    super(app);

    this.containerEl.createEl('h1', {text: 'Download Conflict'})
    this.containerEl.createEl('p', {text: `There was a conflict with file ${params.filename}:`})

    // @ts-ignore
    if (params.localCreatedTimestamp > params.remoteCreatedTimestamp) {
      this.containerEl.createEl('p', {text: `Created at local: ${formatDate(params.localCreatedTimestamp)}.`})
    }

    // @ts-ignore
    if (params.localUpdatedTimestamp > params.remoteUpdatedTimestamp) {
      this.containerEl.createEl('p', {text: `Updated at local: ${formatDate(params.localUpdatedTimestamp)}.`})
    }

    const addButton = (buttonsEl: any, text: string, result: DownloadConflictResult): void => {
      buttonsEl
        .createEl('button', {text: text})
        .addEventListener('click', (): void => {
          this._result = result
          this.close()
        })
    }

    this.containerEl.createDiv('modal-button-container', (buttonsEl: any): void => {
      addButton(buttonsEl, 'Ignore', DownloadConflictResult.Ignore)
      addButton(buttonsEl, 'Ignore All', DownloadConflictResult.IgnoreAll)
      addButton(buttonsEl, 'Overwrite', DownloadConflictResult.Overwrite)
      addButton(buttonsEl, 'Overwrite All', DownloadConflictResult.OverwriteAll)
    })
  }

  public get result(): DownloadConflictResult | null {
    return this._result
  }
}
