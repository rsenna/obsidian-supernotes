export type LinkType = 'wikilink' | 'markdown';
export const WIKILINK_REGEX = /\[\[[^\]]+\]\]/gu;
export const MARKDOWN_LINK_REGEX = /\[[^\]]+\]\([^\)]+\)/gu;

export class Link {
	_linkType?: LinkType;
	_alias: string;
	_address: string;

	constructor(text: string) {
		console.log('text', text)

		if (WIKILINK_REGEX.test(text)) {
			console.log('WIKILINK regex match');

			this._linkType = 'wikilink';
			this._alias = text.split('|')[0].slice(2).trim();
			this._address = text.split('|')[1].slice(0, -2).trim();
		} else if (MARKDOWN_LINK_REGEX.test(text)) {
			console.log('MARKDOWN regex match');

			this._linkType = 'markdown';
			this._alias = text.split(']')[0].slice(1).trim();
			this._address = text.split(']')[1].slice(2, -1).trim();
		} else {
			console.log('NO regex match');

			this._linkType = undefined;
			this._alias = '';
			this._address = '';
		}
	}

	get linkType(): LinkType | undefined {
		return this._linkType;
	}

	set linkType(linkType: LinkType) {
		this._linkType = linkType;
	}

	get alias(): string {
		return this._alias;
	}

	set alias(alias: string) {
		this._alias = alias;
	}

	get address(): string {
		return this._address;
	}

	set address(address: string) {
		this._address = address;
	}

	get text(): string {
		return this._linkType === 'wikilink'
			? this._alias
				? `[[${this._address}|${this._alias}]]`
				: `[[${this._address}]]`
			: this._linkType === 'markdown'
				? this._alias
					? `[${this._alias}](${this._address})`
					: `[${this._address}](${this._address})`
				: '';
	}
}

