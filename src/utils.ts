// From https://github.com/Lisandra-dev/obsidian-create-note-in-folder/blob/master/src/utils/utils.ts

// TODO: remove dependency on CustomVariables

import {CustomVariables} from "./interface"
import {DateTime} from "luxon"
import {moment} from "obsidian"

// TODO: remove hardcoded UTC offset
const timestampFormat = 'YYYY-MM-DD[T]HH:mm:ss'
const timestampFormatOffset = (utcOffset: string): string =>
  timestampFormat + utcOffset

// TODO use Luxon?
// TODO offset should not be coupled to ISO format nor moment/luxon; maybe use a number instead of a string?
export const formatDate = (date: string, utcOffset?: string): string =>
  moment(date).format(utcOffset ? timestampFormatOffset(utcOffset) : timestampFormat)

export const isObject = (o: any) =>
  o instanceof Object && o.constructor === Object

export const isValidDate = (date: string): boolean =>
  DateTime.fromISO(date).isValid

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
