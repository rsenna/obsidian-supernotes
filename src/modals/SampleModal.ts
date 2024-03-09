import {App, Modal} from "obsidian";

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
