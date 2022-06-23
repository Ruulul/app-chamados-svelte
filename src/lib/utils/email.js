/**
 * @typedef {('open'|'taken'|'released'|'message'|'closed')} EmailTypes Tipos existentes de email
 */
const EmailTypes = ['open', 'taken', 'released', 'message', 'closed']
import open from '$lib/email_templates/open.svelte'
import message from '$lib/email_templates/message.svelte'
import taken from '$lib/email_templates/taken.svelte'
import released from '$lib/email_templates/released.svelte'
import closed from '$lib/email_templates/closed.svelte'
const SecureToken = "59fa2524-23b0-4dc1-af39-82ac290ca35c";
/** Objeto de envio de emails */
const Email = {
	send: function (a) {
	  return new Promise(function (n, e) {
		(a.nocache = Math.floor(1e6 * Math.random() + 1)), (a.Action = "Send");
		var t = JSON.stringify(a);
		Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) {
		  n(e);
		});
	  });
	},
	ajaxPost: function (e, n, t) {
	  var a = Email.createCORSRequest("POST", e);
	  a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
		(a.onload = function () {
		  var e = a.responseText;
		  null != t && t(e);
		}),
		a.send(n);
	},
	ajax: function (e, n) {
	  var t = Email.createCORSRequest("GET", e);
	  (t.onload = function () {
		var e = t.responseText;
		null != n && n(e);
	  }),
		t.send();
	},
	createCORSRequest: function (e, n) {
	  var t = new XMLHttpRequest();
	  return (
		"withCredentials" in t
		  ? t.open(e, n, !0)
		  : "undefined" != typeof XDomainRequest
			? (t = new XDomainRequest()).open(e, n)
			: (t = null),
		t
	  );
	},
};
/** Mapeamento dos templates */
const templatesMap = {
	open,
	message,
	taken,
	released,
	closed
}
/** Mapeamento dos assuntos */
const subjectMap = {
	message: 'nova mensagem',
	taken: 'assumido!',
	released: 'colocado em espera',
	closed: 'fechado'
}
/** Props válidos por template */
const propsMap = {
	open	: ['idOS', 'assunto'],
	message	: ['idOS', 'nome', 'nomeAutor', 'mensagem'],
	taken	: ['idOS', 'nomeSuporte'],
	released: ['idOS'],
	closed	: ['idOS', 'nome']
}
const from_email = "suporte.ti@ourobrancoagronegocios.com.br"
export { from_email as email_suporte }

/**
 * Envia email
 * @param {EmailTypes} tipo Tipo do email a ser mandado
 * @param {string | string[]} para Array de emails que irá receber
 * @param {Object} props Lista de props para hidratar o template de email
 */
export async function sendEmail (tipo, para, props) {
	if (EmailTypes.includes(tipo))
	return Email.send(
		{
			SecureToken,
			From: from_email,
			To: para,
			Subject: 'Gold Seed - ' + createSubject(tipo, props),
			Body: getBody(tipo, props)
		}
	)
	throw new Error('Tipo inválido')
}

/**
 * 
 * @param {EmailTypes} tipo 
 * @param {Object} props 
 */
 function createSubject(tipo, {idOS}) {
	if (tipo === 'open')
		return `Chamado aberto com código ${idOS}`
	else
		return `Chamado ${idOS} - ${subjectMap[tipo]}`
}
/**
 * 
 * @param {EmailTypes} tipo 
 * @param {Object} props 
 */
function getBody(tipo, props) {
	return createHTML(templatesMap[tipo], filterProps(props))
	
	function filterProps (props) {
		return Object.fromEntries(
			Object.entries(props)
			.filter(
				function isPropinMap(prop){
					return propsMap[tipo].includes(prop[0])
				}
			)
		)
	}
}

/**
 * 
 * @param {*} template 
 * @param {Object} props 
 * @returns {string} string HTML baseada em um template .svelte
 */
function createHTML (template, props) {
    let div = document.createElement('div')
	let target = div.attachShadow({mode: 'open'})
	let el = new template({target, props})
	let html = target.innerHTML
	console.log(html)
	el.$destroy()
	div.remove()
	return html
}