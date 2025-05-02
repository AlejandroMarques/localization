import * as fs from 'fs';
import { LanguageStrategy } from '@/types/LanguageStrategy.js';
import { FilteredLanguage } from '@/types/FilteredLanguage.js';

export class JsonStrategy implements LanguageStrategy {
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
    fs.writeFileSync(`./languages/${code}.json`, fileData);
    console.log(`Language created`);
  }

  createNewKey(key: string, defaultValue: string): void {
    const currentLanguages = fs.readdirSync('./languages');
    const jsonFiles = currentLanguages.filter(
      (file) => file.split('.')[1] === 'json',
    );

    for (const language of jsonFiles) {
      const fileData = fs.readFileSync(`./languages/${language}`, 'utf-8');
      const lang = JSON.parse(fileData);
      if (lang[key]) continue;
      lang[key] = {
        text: defaultValue,
        description: '',
        comment: '',
      };

      fs.writeFileSync(`./languages/${language}`, JSON.stringify(lang));
    }
    console.log(`Key created`);
  }

  deleteKey(key: string): void {
    const currentLanguages = fs.readdirSync('./languages');
    const jsonFiles = currentLanguages.filter(
      (file) => file.split('.')[1] === 'json',
    );

    for (const language of jsonFiles) {
      const fileData = fs.readFileSync(`./languages/${language}`, 'utf-8');
      const lang = JSON.parse(fileData);
      delete lang[key];
      fs.writeFileSync(`./languages/${language}`, JSON.stringify(lang));
    }
    console.log(`Key deleted`);
  }

  translateKey(key: string, language: string): FilteredLanguage | null {
    let file = fs.readFileSync(`./languages/${language}.json`, 'utf-8');
    file = JSON.parse(file);
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
