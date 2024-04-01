import {Plugin} from 'obsidian'
import {DEFAULT_SETTINGS, HasSettings, SupernotesPluginSettings, SupernotesSettingTab} from 'src/settings'
import * as commands from './commands'

export default class SupernotesPlugin extends Plugin implements HasSettings {
  settings: SupernotesPluginSettings

  async onload() {
    await this.loadSettings()

    // This creates an icon in the left ribbon.
    // const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (_evt: MouseEvent) => {
    //   // Called when the user clicks the icon.
    //   new Notice('This is a notice!')
    // })

    // Perform additional things with the ribbon
    // ribbonIconEl.addClass('my-plugin-ribbon-class')

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem()
    statusBarItemEl.setText('')

    // Simple Command: Download notes
    this.addCommand({
      id: 'simple-synchronize-notes',
      name: 'Synchronize notes',
      callback: async () => {
        await commands.downloadAll(this.app, this.settings, statusBarItemEl)
      }
    })

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SupernotesSettingTab(this.app, this))
  }

  onunload() {
    // TODO: delete if unused
  }

  async loadSettings(): Promise<SupernotesPluginSettings> {
    this.settings = this.recursiveMerge(DEFAULT_SETTINGS, await this.loadData())
    console.debug('Loaded settings: ', this.settings)
    return this.settings
  }

  async saveSettings() {
    await this.saveData(this.settings)
    console.debug('Saved settings: ', this.settings)
  }

  // Avoid issues with overriding sub-properties without considering extra deep properties on target
  // (which happens with Object.assign and ts spread operator)
  recursiveMerge(target: any, source: any) {
    const result = { ...target }

    for (const sourceKey in source) {
      if (typeof result[sourceKey] !== 'object') {
        result[sourceKey] = source[sourceKey]
      } else if (typeof source[sourceKey] === 'object') {
        result[sourceKey] = this.recursiveMerge(result[sourceKey], source[sourceKey])
      }
    }

    return result
  }
}
