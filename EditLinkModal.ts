import { Link, LinkType } from "Link";
import { App, Editor, Modal, Setting } from "obsidian";

type Action = () => void;

export class EditLinkModal extends Modal {
	editor: Editor;
	onSubmit: Action;

	constructor(app: App, editor: Editor, onSubmit: Action) {
		super(app);

		this.editor = editor;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl('h1', {text: 'Edit Link'});

		const link = this.getLinkUnderCursor();
		console.log('linkType', link?.linkType)
		console.log('alias', link?.alias)
		console.log('address', link?.address)
		console.log('text', link?.text)

		new Setting(contentEl)
			.setName('Link Text/Alias')
			.addText(text => 
				text.onChange(async (value) => {
					if (link) {
						link.alias = value;
						this.editor.replaceRange(link.text, this.editor.getCursor('head'));
					}
				}
			));

		new Setting(contentEl)
			.setName('Link Address')
			.addText(text =>
				text.onChange(async (value) => {
					if (link) {
						link.address = value;
						this.editor.replaceRange(link.text, this.editor.getCursor('head'));
					}
				}
			));

		new Setting(contentEl)
			.addButton((btn) =>
			  btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
				  this.close();
				  this.onSubmit();
				}));	
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	getLinkUnderCursor(): Link | undefined {
		const cursor = this.editor.getCursor();
		const currentLine = this.editor.getLine(cursor.line);

		var linkType: LinkType | undefined = undefined
		var linkStart = cursor.ch
		var linkEnd = cursor.ch
		var foundStart = false
		var foundEnd = false
		var markdownFoundOpenParenthesis = false

		while (linkStart >= 0 && linkEnd <= currentLine.length) {
			if (!foundStart) {
				if (currentLine[linkStart] === '[') {
					if (currentLine[linkStart - 1] === '[') {
						linkStart--;
						linkType = 'wikilink';
						foundStart = true;
					} else if (currentLine[linkStart + 1] === '[') {
						linkType = 'wikilink';
						foundStart = true;
					} else {
						linkType = 'markdown';
						foundStart = true;
					}
				} else {
					linkStart--;
				}
			}

			if (foundStart && !foundEnd) {
				if (linkType == 'markdown') {
					if (currentLine[linkEnd] === ']' && currentLine[linkEnd + 1] === '(') {
						linkEnd += 2;
						markdownFoundOpenParenthesis = true;
					}

					if (markdownFoundOpenParenthesis && currentLine[linkEnd] === ')') {
						foundEnd = true;
						break;
					}
				} else if (linkType == 'wikilink') {
					if (currentLine[linkEnd] === ']' && currentLine[linkEnd + 1] === ']') {
						linkEnd++;
						foundEnd = true;
						break;
					}
				}

				linkEnd++;
			}
		}

		// DEBUG:
		// console.log('getLinkUnderCursor: currentLine', currentLine)
		// console.log('getLinkUnderCursor: currentLine.length', currentLine.length)
		// console.log('getLinkUnderCursor: foundStart', foundStart)
		// console.log('getLinkUnderCursor: foundEnd', foundEnd)
		// console.log('getLinkUnderCursor: linkType', linkType)
		// console.log('getLinkUnderCursor: linkStart', linkStart)
		// console.log('getLinkUnderCursor: linkEnd', linkEnd)

		const text = foundStart && foundEnd
			? currentLine.slice(linkStart, linkEnd + 1)
			: ''

		const link = text
			? new Link(text)
			: undefined

		return link
	}
}
