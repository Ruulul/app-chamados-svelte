/**
 * @typedef {('open'|'taken'|'started'|'released'|'message'|'closed'|'on_hold')} EmailTypes Tipos existentes de email
 */
const EmailTypes = ['open', 'taken', 'started', 'released', 'message', 'closed', 'on_hold', 'rejected']
import open from '$lib/email_templates/open.svelte'
import message from '$lib/email_templates/message.svelte'
import taken from '$lib/email_templates/taken.svelte'
import started from '$lib/email_templates/started.svelte'
import released from '$lib/email_templates/released.svelte'
import closed from '$lib/email_templates/closed.svelte'
import on_hold from '$lib/email_templates/onhold.svelte'
import rejected from '$lib/email_templates/rejected.svelte'
import { origin } from './network'
import { formatTag } from './utils'
const SecureToken = "e1c686b1-9ec6-47e6-a8a4-84914157acb0";
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
	started,
	released,
	closed,
	on_hold,
	rejected,
}
/** Mapeamento dos assuntos */
const subjectMap = {
	message: 'nova mensagem',
	taken: 'assumido!',
	started: 'atendimento iniciado',
	released: 'colocado em espera',
	closed: 'fechado',
	on_hold: 'aguardando',
	rejected: 'rejeitado',
}
/** Props válidos por template */
const propsMap = {
	open	: ['idOS', 'assunto', 'nome'],
	message	: ['idOS', 'nomeAutor', 'mensagem'],
	taken	: ['idOS', 'nomeSuporte'],
	started : ['idOS'],
	released: ['idOS'],
	closed	: ['idOS', 'last_msg'],
	on_hold : ['idOS', 'status'],
	rejected: ['idOS', 'last_msg'],
}
const from_email = "suporte.ti@ourobrancoagronegocios.com.br"
const From = from_email
export { from_email as email_suporte }

/**
 * Envia email
 * @param {EmailTypes} tipo Tipo do email a ser mandado
 * @param {string | string[]} To Array de emails que irá receber
 * @param {Object} props Lista de props para hidratar o template de email
 */
export async function sendEmail (tipo, To, props) {
	if (EmailTypes.includes(tipo))
	return Email.send(
		{
			SecureToken,
			From,
			To,
			Subject: 'Gold Seed - ' + createSubject(tipo, props),
			Body: getBody(tipo, props) + abrirNovaAba(props.idOS, props.tag)
		}
	)
	return new Error('Tipo inválido')
}

/**
 * 
 * @param {EmailTypes} tipo 
 * @param {Object} props 
 */
 function createSubject(tipo, {idOS, tag}) {
	if (tipo === 'open')
		return `${formatTag(tag)} aberto com código ${idOS}`
	else
		return `${formatTag(tag)} ${idOS} - ${subjectMap[tipo]}`
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

function abrirNovaAba (idOS, tag) {
	return `
		<br><br>
		<a href='${origin}/processo/${tag}/${idOS}' target='_blank'>Abrir OS em nova aba</a>
	`
}

/**
 * 
 * @param {*} template 
 * @param {Object} props 
 * @returns {string} string HTML baseada em um template .svelte
 */
function createHTML (template, props) {
    let target = document.createElement('div')
	let el = new template({target, props})
	let html = target.innerHTML
	console.log(html)
	el.$destroy()
	target.remove()
	return html
}