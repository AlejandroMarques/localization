import { FilteredLanguage } from './FilteredLanguage.js';

export interface LanguageStrategy {
  /**
   * Función para crear un nuevo idioma.
   * @param code Código del nuevo idioma. El formato tiene que es "en-GB".
   */
  createNewLanguage(code: string): void;

  /**
   * Función para crear una nueva entrada.
   * @param key Nombre de la nueva entrada.
   * @param defaultValue Valor por defecto de la nueva entrada, por defecto es "".
   */
  createNewKey(key: string, defaultValue: string): void;

  /**
   * Función para eliminar una entrada.
   * @param key Nombre de la entrada que se va a eliminar.
   */
  deleteKey(key: string): void;

  /**
   * Función que devuelve el valor correspondiente de una entrada en el idioma indicado.
   * @param key Nombre de la entrada que se va a traducir.
   * @returns Valor traducido.
   */
  translateKey(key: string, language: string): FilteredLanguage;
}
