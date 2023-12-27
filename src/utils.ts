// From https://github.com/Lisandra-dev/obsidian-create-note-in-folder/blob/master/src/utils/utils.ts

import {App, moment} from "obsidian";
import {CustomVariables, FolderSettings} from "./interface"; // TODO: remove import

export function validateDate(date: string) {
  return moment(moment().format(date), date, true).isValid();
}

export const isObject = (o: any) =>
  o instanceof Object && o.constructor === Object

export function isTemplaterNeeded(app: App, settings: FolderSettings) {
  //@ts-ignore
  return app.plugins.enabledPlugins.has("templater-obsidian") && settings.templater;
}

export function replaceVariables(filePath: string, customVariables: CustomVariables[]) {
  const hasBeenReplaced: boolean[] = [];

  for (const variable of customVariables) {
    if (filePath.match(`{{${variable.name}}}`)) {

      if (variable.type === "string") {
        filePath = filePath.replace(`{{${variable.name}}}`, variable.value);
      } else {
        filePath = filePath.replace(`{{${variable.name}}}`, moment().format(variable.value));
      }

      hasBeenReplaced.push(true);

    } else if (variable.name.match(/^\/.+\/[gimy]*$/)) {
      const regex = new RegExp(variable.name.replace(/^\/(.+)\/[gimy]*$/, "{{$1}}"), variable.name.replace(/^\/.+\/([gimy]*)$/, "$1"));

      if (filePath.match(regex)) {
        filePath = filePath.replace(regex, variable.value);
        hasBeenReplaced.push(true);
      }
    }
  }

  return { path: filePath, hasBeenReplaced: hasBeenReplaced.length > 0 };
}
