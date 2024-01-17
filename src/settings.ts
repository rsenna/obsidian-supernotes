import SupernotesPlugin from 'src/main';

import { PluginSettingTab, App, Setting } from "obsidian";

export enum SyncOptions {
  Never = 0,
  ByTimestamp,
  Always
}

export enum DeleteOptions {
  Never = 0,
  Local,
  Remote
}

export interface SupernotesPluginSettings {
  basic: {
    apiKey: string
    folder: string
  },
  junk: {
    enabled: boolean
    folder: string
  },
  syncRules: {
    download: SyncOptions,
    upload: SyncOptions,
    delete: DeleteOptions
  }
}

export const DEFAULT_SETTINGS: SupernotesPluginSettings = {
  basic: {
    apiKey: '',
    folder: 'supernotes',
  },
  junk: {
    enabled: false,
    folder: 'supernotes/junk'
  },
  syncRules: {
    download: SyncOptions.ByTimestamp,
    upload: SyncOptions.ByTimestamp,
    delete: DeleteOptions.Never
  }
};

export interface HasSettings {
  loadSettings(): Promise<SupernotesPluginSettings>
  saveSettings(): Promise<void>
}

export class SupernotesSettingTab extends PluginSettingTab {
  plugin: SupernotesPlugin

  constructor(app: App, plugin: SupernotesPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  async display(): Promise<void> {
    const { containerEl } = this
    containerEl.empty()

    const syncDropdownOptions = {
      [SyncOptions.Never]: 'Never',
      [SyncOptions.ByTimestamp]: 'By timestamp',
      [SyncOptions.Always]: 'Always'
    } as Record<string, string>

    const deleteDropdownOptions = {
      [DeleteOptions.Never]: 'Never',
      [DeleteOptions.Remote]: 'Remotely, after download',
      [DeleteOptions.Local]: 'Locally, after upload'
    }

    const createHeader = (text: string, desc?: string) => {
      const header = this.containerEl.createDiv({ cls: 'setting-item setting-item-heading' });
      header.createDiv({ text, cls: 'setting-item-name' })
      header.ariaLabel = desc  ?? null
    }

    const setJunkFolderVisible = (value: boolean) =>
      containerEl.find('.txt-junk-folder').toggleClass('invisible', !value)

    createHeader('Basic', 'Required information when connecting with Supernotes')

    new Setting(containerEl)
      .setName('Supernotes API Key')
      .setDesc('Key used for Obsidian to control Supernotes\' database')
      .setClass('api-key')
      .addText(text => text
        .setPlaceholder('Enter your API Key')
        .setValue(this.plugin.settings.basic.apiKey)
        .onChange(async (value) => {
          this.plugin.settings.basic.apiKey = value;
          await this.plugin.saveSettings();
        }))

    new Setting(containerEl)
      .setName('Supernotes Folder')
      .setDesc('Folder in your vault, used for Supernotes download/sync')
      .addText(text => text
        .setPlaceholder('Enter Supernotes folder path')
        .setValue(this.plugin.settings.basic.folder)
        .onChange(async (value) => {
          this.plugin.settings.basic.folder = value;
          await this.plugin.saveSettings();
        }))

    createHeader('Junk', 'What to do with "junk" (i.e. logically deleted) Supernotes entries')

    new Setting(containerEl)
      .setName('Download Junk')
      .setDesc('If we should download junk notes from Supernotes')
      .addToggle(it => it
        .setValue(this.plugin.settings.junk.enabled)
        .onChange(async (value: boolean): Promise<void> => {
          this.plugin.settings.junk.enabled = value
          await this.plugin.saveSettings()
          setJunkFolderVisible(value)
        })
      )

    new Setting(containerEl)
      .setClass('txt-junk-folder')
      .setName('Junk Folder')
      .setDesc('Folder to be used when downloading junk notes')
      .addText(it => it
        .setPlaceholder('Enter Supernotes Junk folder path')
        .setValue(this.plugin.settings.junk.folder)
        .onChange(async (value: string): Promise<string> =>
          this.plugin.settings.junk.folder = value
        )
      )

    setJunkFolderVisible(this.plugin.settings.junk.enabled)

    createHeader('Sync', 'Rules to be followed when synchronizing Obsidian and Supernotes')

    new Setting(containerEl)
      .setName('Download behaviour')
      .setDesc('If notes should be downloaded from Supernotes')
      .addDropdown(it => it
        .addOptions(syncDropdownOptions)
        .setValue(this.plugin.settings.syncRules.download.toString())
      )

    new Setting(containerEl)
      .setName('Upload behaviour')
      .setDesc('If notes should be uploaded to Supernotes')
      .addDropdown(it => it
        .addOptions(syncDropdownOptions)
        .setValue(this.plugin.settings.syncRules.upload.toString())
      )

    new Setting(containerEl)
      .setName('Delete behaviour')
      .setDesc('If notes should be deleted locally or remotely, and when')
      .addDropdown(it => it
        .addOptions(deleteDropdownOptions)
        .setValue(this.plugin.settings.syncRules.delete.toString())
      )
  }
}
