import SupernotesPlugin from 'main';

import { PluginSettingTab, App, Setting } from "obsidian";

export interface SupernotesPluginSettings {
  apiKey: string;
  folder: string;
}
export const DEFAULT_SETTINGS: SupernotesPluginSettings = {
  apiKey: 'set API key here',
  folder: 'supernotes'
};

export class SupernotesSettingTab extends PluginSettingTab {
  plugin: SupernotesPlugin;

  constructor(app: App, plugin: SupernotesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Supernotes API Key')
      .setDesc('Key used for Obsidian to control Supernotes\' database')
      .addText(text => text
        .setPlaceholder('Enter your API Key')
        .setValue(this.plugin.settings.apiKey)
        .onChange(async (value) => {
          this.plugin.settings.apiKey = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Supernotes Folder')
      .setDesc('Folder in your vault, used for Supernotes download/sync')
      .addText(text => text
        .setPlaceholder('Enter Supernotes folder path')
        .setValue(this.plugin.settings.folder)
        .onChange(async (value) => {
          this.plugin.settings.folder = value;
          await this.plugin.saveSettings();
        }));
  }
}
