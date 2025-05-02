import { languages } from './languages.js';
import { CsvStrategy } from './strategies/CsvStrategy.js';
import { JsonStrategy } from './strategies/JsonStrategy.js';
import { FilteredLanguage } from '@/types/FilteredLanguage.js';

const strategy = new JsonStrategy();
// const strategy = new CsvStrategy();

/**
 * Función para buscar una lista de idiomas.
 * @param term Texto a buscar.
 * @returns Devuelve un array de los idiomas con la estructura definida.
 */
const searchLanguage = (term: string): FilteredLanguage[] => {
  const filtered: FilteredLanguage[] = [];

  const cleanTerm = term.toLowerCase();
  languages.forEach((item) => {
    const cleanLocale = item.locale.toLowerCase();
    const cleanLanguage = item.language.name.toLowerCase();
    const cleanCountry = item.country.name.toLowerCase();

    if (
      cleanLocale.includes(cleanTerm) ||
      cleanLanguage.includes(cleanTerm) ||
      cleanCountry.includes(cleanTerm)
    ) {
      filtered.push({
        language: item.language.name,
        country: item.country.name,
        code: item.locale,
      });
    }
  });

  return filtered;
};
//console.table(searchLanguage('spanish'));
// strategy.createNewLanguage('es-ES');
//strategy.createNewKey('bye', 'Bye');
//strategy.deleteKey('new');
console.log(strategy.translateKey('bye', 'en-GB'));
