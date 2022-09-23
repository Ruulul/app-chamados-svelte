import insane from "insane";
import { marked } from "marked";
import { getUser } from "./db";
import { getEtapas, getDept } from "./cadastros";
import { sendEmail } from "./email";
/**
 * @param {number} ms Miliseconds to await 
 * @returns 
 */
export const sleep = ms => new Promise(r => setTimeout(r, ms));

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

export function TimeFromSeconds (utc_seconds) {
    let timezone = - 1000 * 60 * 60 * 3;
    let seconds = utc_seconds + timezone;
    return `
        ${Math.floor(seconds/86400)}d ${(Math.floor(seconds/3600) % 24).toString().padStart(2, '0')}h${(Math.floor(seconds/60)%60).toString().padStart(2, '0')}min
    `
}

export function formatTag (tag) {
  return tag.includes('_') ? tag.split('_')
  .map((/**@type {string}*/s)=>
      Array.prototype
      .reduce.call(s, (pv, cv, index)=>{
          if (index === 0)
              cv = cv.toUpperCase()
          return pv + cv
      }, ""))
  .join(' ') : tag
}

export function filterPendente (processo) {
  return Object.fromEntries(processo.etapa.campos)["status"] !== 'fechado'
}

/**
 * Retorna uma data de acordo com a prioridade e com a abertura.
 * Prioridade 1 - 7 dias;
 * Prioridade 2 - 3 dias;
 * Prioridade 3 - 1 dia;
 * Prioridade 4 - 8 horas;
 * @typedef {{ createdAt: string, campos: string[][]}} ObjWithCamposField 
 * @param {ObjWithCamposField} obj
 * @returns {{
 *  obj: ObjWithCamposField,
 *  ven: Date?,
 * }} 
 */
export function assignVencimento (obj) {
  let campos = Object.fromEntries(obj.campos);
  let return_obj = { obj, ven: null };
  if (!campos || !('prioridade' in campos) || !('createdAt' in obj)) return return_obj;
  let createdDate = new Date(obj.createdAt);
  let createdTimestamp = createdDate.getMilliseconds();
  switch (parseInt(campos.prioridade)) {
    case 1:
                        //ms * s * min * h * d
      let sete_dias_ms = 1000 * 60 * 60 * 24 * 7;
      return_obj.ven = new Date(createdTimestamp + sete_dias_ms);
      break;
    case 2:
      let tres_dias_ms = 1000 * 60 * 60 * 24 * 3;
      return_obj.ven = new Date(createdTimestamp + tres_dias_ms);
      break;
    case 3:
      let um_dia_ms = 1000 * 60 * 60 * 24 * 1;
      return_obj.ven = new Date(createdTimestamp + um_dia_ms);
      break;
    case 4:
      let oito_horas_ms = 1000 * 60 * 60 * 3;
      return_obj.ven = new Date(createdTimestamp + oito_horas_ms);
      break;
  }
  return return_obj;
}
/**
 * @typedef {number} Miliseconds
 * @param {Miliseconds} offset 
 * @returns função que pega o retorno de `assignVencimento` e filtra se está vencido, pelo offset
 */
export function filterVencidos (offset = 0) {
  return function (obj) {
    return Date.now() + offset > obj.ven?.getMilliseconds()
  }
}


    /**
     * Lista encadeada de status com status.
     */
     export const proximo_status = {
      'em analise': 'pendente',
      'pendente': 'em atendimento',
      'em atendimento': 'fechado',
  }

  /**
   * Lista de metadado por status
   */
  export const metadado_hora = {
      'em atendimento': 'inicio_em',
      'fechado': 'fim_em',
      'aguardando solicitante': 'pausa_em',
      'aguardando terceiro': 'pausa_em',
  }



export async function notificaEnvolvidos(processo) {
  console.log('start notifica')
  const status = Object.fromEntries(processo.etapa.campos)?.status
  if (!status) return console.log('notificaEnvolvidos: sem status');
  const template = 
      status === 'fechado' ? 'closed' :
      status === 'rejeitado' ? 'rejected' : 
      status === 'pendente' ? 'taken' :
      status === 'em atendimento' ? 'started' :
      status === 'aguardando solicitante' ? 'on_hold' :
      status === 'aguardando terceiro' ? 'on_hold' :
      null
  if (!template) return console.log('notificaEnvolvidos: sem template');
  const emails = await getEmailsEnvolvidos(processo)
  console.log('emails obtidos: ' + emails.join(', '));
  await sendEmail(template, emails, {
    idOS: processo.id, 
    tag: processo.Tag,
    nomeSuporte: (await getUser(Object.fromEntries(processo.etapa.campos)?.suporteId).catch(()=>({nome: '[erro obtendo nome]'})))?.nome,
    last_msg: processo.log.sort((a, b)=>b.id - a.id)[0]?.descr || '[um erro aconteceu]',
    status,
  }).then(console.log)
}

export async function getEmailsEnvolvidos(processo) {
  const usuario = await getUser(processo.idUsuario);
  const etapas = await getEtapas(processo.idEtapaAtual);
  let emails = [usuario.email];
  
  for (let etapa of etapas) {
      let dept = await getDept(etapa.dept);
      if (!dept) continue;
      if (dept.campos.email)
          emails.push(dept.campos.email);
  }

  return emails;
}