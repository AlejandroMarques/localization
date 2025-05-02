import { csvToJson } from '@/helpers/csv.helper.js';
import { LanguageStrategy } from '@/types/LanguageStrategy.js';
import * as fs from 'fs';
import { jsonToCsv } from '../helpers/csv.helper.js';
import { FilteredLanguage } from '@/types/FilteredLanguage.js';

export class CsvStrategy implements LanguageStrategy {
  createNewLanguage(code: string): void {
    const currentLanguages = fs.readdirSync('./languages');
    const alredyExists = currentLanguages.find((lang) => lang.includes(code));
    if (alredyExists) {
      console.log(`Language with code "${code}" alredy exists`);
      return;
    }

    const similarLanguage = currentLanguages.find((lang) =>
      lang.includes(code.split('-')[0]),
    );
    const fileData = fs.readFileSync(
      `./languages/${similarLanguage ?? currentLanguages[0]}`,
    );
    fs.writeFileSync(`./languages/${code}.csv`, fileData);
    console.log(`Language created`);
  }

  createNewKey(key: string, defaultValue: string): void {
    const currentLanguages = fs.readdirSync('./languages');
    const csvFiles = currentLanguages.filter(
      (file) => file.split('.')[1] === 'csv',
    );
    for (const language of csvFiles) {
      const fileData = csvToJson(`./languages/${language}`);
      if (fileData[key]) continue;
      fileData[key] = {
        text: defaultValue,
        description: '',
        comment: '',
      };
      const line = `${key},${defaultValue},,\n`;

      fs.appendFileSync(`./languages/${language}`, line);
    }
    console.log(`Key created`);
  }

  deleteKey(key: string): void {
    const currentLanguages = fs.readdirSync('./languages');
    const csvFiles = currentLanguages.filter(
      (file) => file.split('.')[1] === 'csv',
    );
    for (const language of csvFiles) {
      const fileData = csvToJson(`./languages/${language}`);
      delete fileData[key];
      fs.writeFileSync(`./languages/${language}`, `${jsonToCsv(fileData)}\n`);
    }
    console.log(`Key deleted`);
  }

  translateKey(key: string, language: string): FilteredLanguage | null {
    const file = csvToJson(`./languages/${language}.csv`);
    if (!file) {
      console.log(`No existe ningún archivo para el idioma "${language}"`);
      return null;
    }
    if (!file[key]) {
      console.log(`No existe la entrada "${key}" para el idioma "${language}"`);
      return null;
    }
    return file[key];
  }
}
