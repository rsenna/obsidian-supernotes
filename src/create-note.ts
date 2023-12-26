// From https://github.com/Lisandra-dev/obsidian-create-note-in-folder/blob/master/src/utils/create_note.ts

import {
  App,
  getLinkpath,
  MarkdownView,
  normalizePath,
  OpenViewState,
  TFile,
  WorkspaceLeaf
} from "obsidian";
import {DefaultOpening, SplitDirection} from "src/interface";

import {SupernotesPluginSettings} from "./settings";

function scrollToPosition(app: App, parts: {
  path: string
  heading?: string
  block?: string
}) {
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

function getLinkParts(path: string, app: App): {
  path: string
  heading?: string
  block?: string
} {
  // Extract the #^block from the path
  const blockMatch = path.match(/\^(.*)$/);
  const block = blockMatch ? blockMatch[1] : undefined;
  // Remove the #^block
  path = path.replace(/(\^.*)$/, "");

  // Extract the #heading from the path
  const headingMatch = path.match(/#(.*)$/);
  const heading = headingMatch ? headingMatch[1] : undefined;
  // Remove the #heading
  path = path.replace(/(#.*)$/, "");

  return {
    path:
      app.metadataCache.getFirstLinkpathDest(
        getLinkpath(path),
        app.workspace.getActiveFile()?.path ?? ""
      )?.path ?? path,
    heading,
    block,
  };
}

function getOpening(app: App, param = DefaultOpening.newTab, split = SplitDirection.vertical) {
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

function getLeafWithNote(app: App, file: TFile): undefined | WorkspaceLeaf {
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

export async function createNoteInFolder(app: App, settings: SupernotesPluginSettings, fileName: string): Promise<TFile> {
  const folder = normalizePath(settings.folder)

  // Create folder if it doesn't exist:
  if (!app.vault.getAbstractFileByPath(folder)) {
    await app.vault.createFolder(folder)
    console.log('created folder')
  }

  console.log('folder', folder)

  const createdFilePath = `${folder}/${fileName}${fileName.endsWith('.md') ? '' : '.md'}`
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

// export function createFolderInCurrent(newFolder: FolderSettings, currentFile: TAbstractFile, plugin: NoteInFolder) {
//   const { settings,app } = plugin;
//   const { folderPath, defaultName, hasBeenReplaced, currentFolder} = generateFileNameWithCurrent(newFolder, currentFile, plugin);
//   if (!app.vault.getAbstractFileByPath(folderPath)) {
//     if (hasBeenReplaced) {
//       //create folder if it doesn't exist
//       app.vault.createFolder(currentFolder.path);
//     } else {
//       new Notice(i18next.t("error.pathNoFound", { path: currentFolder.path }));
//       return;
//     }
//   }
//   console.log(i18next.t("log", { path: currentFolder.path, name: defaultName }));
//   let leaf = getOpening(app, currentFolder);
//
//   const createdFilePath = normalizePath(`${currentFolder.path}/${defaultName}`);
//   const file = app.vault.getAbstractFileByPath(createdFilePath);
//   if (file instanceof TFile) {
//     if (currentFolder.opening !== DefaultOpening.nothing) {
//       //search if the file is already open to prevent opening it twice
//       let leaf = getLeafWithNote(app, file);
//       if (leaf) {
//         leaf.openFile(file, { active: currentFolder.focused });
//         scrollToPosition(app, getLinkParts(defaultName, app));
//       } else {
//         leaf = getOpening(app, currentFolder, currentFolder.opening, currentFolder.splitDefault) as WorkspaceLeaf;
//         leaf.openFile(file, { active: currentFolder.focused });
//       }
//     } else if (currentFolder.alreadyExistOpening.opening !== DefaultOpening.nothing) {
//       //search if the file is already open to prevent opening it twice
//       let leaf = getLeafWithNote(app, file);
//       if (leaf) {
//         leaf.openFile(file, { active: currentFolder.alreadyExistOpening.focused });
//         scrollToPosition(app, getLinkParts(defaultName, app));
//       } else {
//         leaf = getOpening(app, currentFolder, currentFolder.alreadyExistOpening.opening, currentFolder.alreadyExistOpening.splitDefault);
//         if (leaf) leaf.openFile(file, { active: currentFolder.alreadyExistOpening.focused });
//       }
//     }
//   } else if (!file) {
//     if (leaf) {
//       leaf = leaf as WorkspaceLeaf;
//       let timeout = 50;
//       if (settings.timeOutForInlineTitle) {
//         if (settings.timeOutForInlineTitle instanceof Object) {
//           timeout = settings.timeOutForInlineTitle[Platform.isMobile ? "mobile" : "desktop"];
//         } else if (typeof settings.timeOutForInlineTitle === "number") {
//           timeout = settings.timeOutForInlineTitle;
//         }
//       }
//       app.vault.create(createdFilePath, "").then((file) => {
//         leaf?.openFile(file, { active: currentFolder.focused });
//         plugin.triggerTemplater(file, currentFolder);
//       });
//       new Promise((resolve) => {
//         setTimeout(() => {
//           focusInlineTitle(leaf);
//           resolve(undefined);
//         }, timeout);
//       });
//     } else if (isTemplaterNeeded(app, currentFolder)) {
//       //directly templater to create and templating the things
//       const templateFile = app.vault.getAbstractFileByPath(currentFolder.templater ?? "");
//       if (!templateFile || !(templateFile instanceof TFile)) {
//         new Notice(i18next.t("error.templateNotFound", { path: currentFolder.templater }));
//         return;
//       }
//       const folder = app.vault.getAbstractFileByPath(normalizePath(currentFolder.path)) as TFolder;
//       //@ts-ignore
//       app.plugins.plugins["templater-obsidian"].templater.create_new_note_from_template(templateFile, folder, defaultName, false);
//     } else {
//       app.vault.create(createdFilePath, "");
//     }
//   }
// }

async function focusInlineTitle(leaf: WorkspaceLeaf | undefined) {
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
