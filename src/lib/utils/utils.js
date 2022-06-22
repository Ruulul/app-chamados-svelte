import insane from "insane";
import { marked } from "marked";

/** Converte uma string de data para ISO.
 * @param {string} date Representação em texto de uma string gerada por Date() ou date_obj.toString(), no locale pt-BR. 
 * @returns  {string} Dia da data passada, no formato ISO (AAAA-MM-DD)
 */
export function converteDateToISO (date, dict) {
    const conversao = dict || [
    "Jan",    "Jan",
    "Feb",    "Fev",
    "Mar",    "Mar",
    "Apr",    "Abr",
    "May",    "Mai",
    "Jun",    "Jun",
    "Jul",    "Jul",
    "Aug",    "Ago",
    "Sep",    "Set",
    "Oct",    "Out",
    "Nov",    "Nov",
    "Dec",    "Dez",
  ];
      let date_split = date.split(' ')
    return `${date_split[3]}-${String(Math.floor(conversao.indexOf(date_split[1])/2 + 1)).padStart(2, '0')}-${date_split[2]}`
}

/**
 * Converte Markdown para HTML
 * @param {string} md texto em Markdown
 * @returns {string} HTML sanitizado
 */
export function parseMD (md) {
  return insane(marked.parse(md))
}

/**
 * Recebe um objeto de chave-valor e cria uma string css para colocar no elemento
 * @param {Object} style 
 * @returns {string} CSS
 */
export function geraCSS (style) {
  let css = ''
  for (let [key, entry] of Object.entries(style))
      css += `${key}: ${entry};`
  return css
}