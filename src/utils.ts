// From https://github.com/Lisandra-dev/obsidian-create-note-in-folder/blob/master/src/utils/utils.ts

// TODO: remove dependency on CustomVariables

import {CustomVariables} from "./interface"
import {DateTime} from "luxon"
import {moment} from "obsidian"

const timestampFormat = 'YYYY-MM-DD[T]HH:mm:ss'

// TODO: remove hardcoded UTC offset
const timestampFormatDesignator = 'Z'

const timestampFormatOffset = (utcOffset: string): string =>
  timestampFormat + utcOffset

export const asDate = (date: any, utcOffset = timestampFormatDesignator): Date => {
  const text: string = formatDate(date, utcOffset)
  return moment(text).toDate()
}

// TODO: use Luxon?
// TODO: read UTC offset from settings
// TODO: offset should not be coupled to ISO format nor moment/luxon; maybe use a number instead of a string?
export const formatDate = (date: any, utcOffset = timestampFormatDesignator): string =>
  moment(date).format(utcOffset ? timestampFormatOffset(utcOffset) : timestampFormat)

export const getEnumValues = <T extends object>(enumeration: T): Array<T[keyof T]> =>
    Object
        .keys(enumeration)
        .filter(k => isNaN(Number(k)))
        // @ts-ignore
        .map(k => enumeration[k])

export const isAnyOf = <T>(value: T, ...options: T[]): boolean =>
  options.contains(value)

export const isObject = (o: any) =>
  o instanceof Object && o.constructor === Object

export const isString = (o: any) =>
  typeof o === 'string'

export const isValidDateString = (date: any): boolean =>
  isString(date) && DateTime.fromISO(date).isValid

export function replaceVariables(filePath: string, customVariables: CustomVariables[]) {
  const hasBeenReplaced: boolean[] = [];

  for (const variable of customVariables) {
    if (filePath.match(`{{${variable.name}}}`)) {
      filePath = filePath.replace(
        `{{${variable.name}}}`,
        variable.type === "string"
          ? variable.value
          : moment().format(variable.value))

      hasBeenReplaced.push(true);

    } else if (variable.name.match(/^\/.+\/[gimy]*$/)) {
      const regex = new RegExp(
        variable.name.replace(/^\/(.+)\/[gimy]*$/,"{{$1}}"),
        variable.name.replace(/^\/.+\/([gimy]*)$/, "$1"));

      if (filePath.match(regex)) {
        filePath = filePath.replace(regex, variable.value);
        hasBeenReplaced.push(true);
      }
    }
  }

  return { path: filePath, hasBeenReplaced: hasBeenReplaced.length > 0 };
}
