// From https://github.com/Lisandra-dev/obsidian-create-note-in-folder/blob/master/src/utils/create_note.ts

import {App, getLinkpath, MarkdownView, normalizePath, OpenViewState, TFile, WorkspaceLeaf} from "obsidian";
import {DefaultOpening, SplitDirection} from "src/interface";

import {SupernotesPluginSettings} from "./settings";
import {Entry, SupernotesStatus} from "./types";
import * as path from "path";

export const createNoteForEntry = async (
  app: App,
  settings: SupernotesPluginSettings,
  entry: Entry
): Promise<TFile> => {
  const createdFilePath = getNotePath(settings, entry)
  const folder = path.dirname(createdFilePath)
  const fileName = path.basename(createdFilePath)

  // Create folder if it doesn't exist:
  if (!app.vault.getAbstractFileByPath(folder)) {
    await app.vault.createFolder(folder)
    console.debug(`created folder: ${folder}.`)
  }

  const file = app.vault.getAbstractFileByPath(createdFilePath) as TFile
  const openState = {active: true} as OpenViewState

  if (file) {
    const leaf = getLeafWithNote(app, file) || getOpening(app) as WorkspaceLeaf
    await leaf.openFile(file, openState)
    scrollToPosition(app, getLinkParts(fileName, app))
    return file
  }

  const newFile = await app.vault.create(createdFilePath, "")
  const leaf = getOpening(app)

  if (leaf) {
    await leaf.openFile(newFile, openState)
    await focusInlineTitle(leaf)
  }

  return newFile
}

const focusInlineTitle = async (leaf: WorkspaceLeaf | undefined) => {
  if (!leaf) {
    return;
  }

  const titleContainerEl = leaf.view.containerEl.querySelector("div.inline-title");
  if (!titleContainerEl) {
    return;
  }

  // @ts-ignore
  await titleContainerEl.focus();

  window.getSelection()?.selectAllChildren(titleContainerEl);
  return;
}

const getLeafWithNote = (app: App, file: TFile): undefined | WorkspaceLeaf => {
  let openedLeaf: WorkspaceLeaf | undefined = undefined;

  app.workspace.iterateAllLeaves((leaf) => {
    // @ts-ignore
    const leafFile = leaf.view.file as TFile;

    if (leafFile?.path === file.path) {
      openedLeaf = leaf;
    }
  });

  return openedLeaf;
}

type Parts = {
  path: string
  heading?: string
  block?: string
}

function getLinkParts(path: string, app: App): Parts {
  // Extract the #^block from the path
  const blockMatch = path.match(/\^(.*)$/)
  const block = blockMatch ? blockMatch[1] : undefined

  // Remove the #^block
  path = path.replace(/(\^.*)$/, "")

  // Extract the #heading from the path
  const headingMatch = path.match(/#(.*)$/)
  const heading = headingMatch ? headingMatch[1] : undefined

  // Remove the #heading
  path = path.replace(/(#.*)$/, "")

  return {
    path:
      app.metadataCache.getFirstLinkpathDest(
        getLinkpath(path),
        app.workspace.getActiveFile()?.path ?? ""
      )?.path ?? path,
    heading,
    block,
  } as Parts
}

export const getNoteFolder = (settings: SupernotesPluginSettings, entry: Entry): string => {
  const junk = settings.junk.enabled && entry.membership.status === SupernotesStatus.JUNKED
  return normalizePath(junk ? settings.junk.folder : settings.basic.folder)
}

export async function getNoteInFolder(app: App, settings: SupernotesPluginSettings, entry: Entry): Promise<TFile> {
  const filePath = getNotePath(settings, entry)
  return app.vault.getAbstractFileByPath(filePath) as TFile
}

export const getNotePath = (settings: SupernotesPluginSettings, entry: Entry): string => {
  const folder = getNoteFolder(settings, entry)

  // TODO: name should be decided based on settings
  const fileName = `${entry.data.id}.md`

  return `${folder}/${fileName}`
}

function getOpening(app: App, param = DefaultOpening.nothing, split = SplitDirection.vertical) {
  switch (param) {
    case DefaultOpening.split:
      return app.workspace.getLeaf("split", split);
    case DefaultOpening.newWindow:
      return app.workspace.getLeaf("window");
    case DefaultOpening.newTab:
      return app.workspace.getLeaf(true);
    case DefaultOpening.nothing:
      return undefined;
    default:
      return app.workspace.getLeaf(false);
  }
}

function scrollToPosition(app: App, parts: Parts) {
  const cache = app.metadataCache.getCache(parts.path);
  const view = app.workspace.getActiveViewOfType(MarkdownView);

  if (!view || !cache) return;

  // Get the corresponding position for the heading/block
  if (parts.heading) {
    const heading = cache.headings?.find(
      heading => heading.heading === parts.heading
    );

    if (heading) {
      view.editor.setCursor(heading.position.start.line);
    }

  } else if (parts.block) {
    const block = cache.blocks?.[parts.block];

    if (block) {
      view.editor.setCursor(block.position.start.line);
    }
  }
}
