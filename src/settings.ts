import SupernotesPlugin from 'src/main';

import { PluginSettingTab, App, Setting } from "obsidian";

export interface SupernotesPluginSettings {
  apiKey: string
  folder: string
  isJunkEnabled: boolean
  junkFolder: string
}

export const DEFAULT_SETTINGS: SupernotesPluginSettings = {
  apiKey: 'set API key here',
  folder: 'supernotes',
  isJunkEnabled: false,
  junkFolder: 'supernotes/junk'
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

  display(): void {
    const { containerEl } = this

    containerEl.empty()

    new Setting(containerEl)
      .setName('Supernotes API Key')
      .setDesc('Key used for Obsidian to control Supernotes\' database')
      .addText(text => text
        .setPlaceholder('Enter your API Key')
        .setValue(this.plugin.settings.apiKey)
        .onChange(async (value) => {
          this.plugin.settings.apiKey = value;
          await this.plugin.saveSettings();
        }))

    new Setting(containerEl)
      .setName('Supernotes Folder')
      .setDesc('Folder in your vault, used for Supernotes download/sync')
      .addText(text => text
        .setPlaceholder('Enter Supernotes folder path')
        .setValue(this.plugin.settings.folder)
        .onChange(async (value) => {
          this.plugin.settings.folder = value;
          await this.plugin.saveSettings();
        }))

    new Setting(containerEl)
      .setName('Download Junk')
      .setDesc('If we should download your deleted/junk notes from Supernotes')
      .addToggle(it => it
        .setValue(this.plugin.settings.isJunkEnabled)
        .onChange(async (value: boolean): Promise<void> => {
          if (value) {
            new Setting(containerEl)
              .setClass('txt-junk-folder')
              .setName('Junk Folder')
              .setDesc('Folder to be used when downloading junk notes from Supernotes')
              .addText(it => it
                .setPlaceholder('Enter Supernotes Junk folder path')
                .setValue(this.plugin.settings.junkFolder)
                .onChange(async (value: string): Promise<string> =>
                  this.plugin.settings.junkFolder = value))

          } else {
            containerEl.find('.txt-junk-folder').remove()
          }

          this.plugin.settings.isJunkEnabled = value
          await this.plugin.saveSettings()
        }))
  }
}
