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



export function scopedStore (initialValue) {
	let value = initialValue
	return (function () {
		return new Store({
			get(){return value},
			set(newValue){value=newValue}
		})
	})();
}

/**
 * @type {Store} (padrão Observer) que mantém sincronizado as informações atuais de alguma variável,
 * permitindo reatividade assim que ela muda, para quando há valores que dependem disso
 * @param {Function} getInfo Função que retorna o valor observado
 */
export function Store ({
  	get: getInfo, 
  	isValid: isInfoValid, 
  	set: setInfo
  }) {
  	this.observers = []
  	this.subscribe = subscribe(getInfo).bind(this)
  	this.notify = notify(getInfo).bind(this)
  	this.set = set(setInfo, isInfoValid).bind(this)
    this.update = update.bind(this)
    
    function set (setInfo, isInfoValid) {
      return function set (newInfo) {
        if (isInfoValid)
          if (!isInfoValid(newInfo))
            return
        setInfo(newInfo)
        this.notify()
      }
  }

    function update (update) {
      let newInfo = update(getInfo())
      if (isInfoValid)
        if (!isInfoValid(newInfo))
          return
      this.set(newInfo)
    }

    function subscribe (getInfo) {
      return function subscribe (subscription) {
        subscription(getInfo())
        this.observers.push(subscription)
        return () => this.observers = this.observers.filter(sub=>sub!==subscription)
      }
    }
  
    function notify (getInfo) {
      return function notify () { 
        console.log('notfy')
        this.observers.forEach(subscription=>subscription(getInfo()))
      }
    }
}

export function TimeFromSeconds (seconds) {
    return `
        ${Math.floor(seconds/86400)} dias \n
        ${Math.floor(seconds/3600) % 24}h 
        ${Math.floor(seconds/60)%60}min ${seconds%60}s
    `
}