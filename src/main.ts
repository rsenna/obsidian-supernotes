import {App, Modal, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, HasSettings, SupernotesPluginSettings, SupernotesSettingTab} from 'src/settings';
import * as commands from './commands'

export default class SupernotesPlugin extends Plugin implements HasSettings {
  settings: SupernotesPluginSettings;

  async onload() {
    await this.loadSettings();

    // This creates an icon in the left ribbon.
    // const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (_evt: MouseEvent) => {
    //   // Called when the user clicks the icon.
    //   new Notice('This is a notice!');
    // });

    // Perform additional things with the ribbon
    // ribbonIconEl.addClass('my-plugin-ribbon-class');

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText('');

    // Simple Command: Download notes
    this.addCommand({
      id: 'simple-synchronize-notes',
      name: 'Synchronize notes',
      callback: async () => {
        await commands.downloadAll(this.app, this.settings, statusBarItemEl)
      }
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SupernotesSettingTab(this.app, this));
  }

  onunload() {

  }

  async loadSettings(): Promise<SupernotesPluginSettings> {
    return this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SampleModal extends Modal {
  text: string;

  constructor(app: App, text: string) {
    super(app);
    this.text = text;
  }

  onOpen() {
    const {contentEl} = this;
    contentEl.setText(this.text);
  }

  onClose() {
    const {contentEl} = this;
    contentEl.empty();
  }
}
