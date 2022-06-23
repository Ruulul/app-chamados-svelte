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
	switch(tipo) {
		case 'open':
			return `Chamado aberto com código ${idOS}`
		case 'message':
			return `Chamado ${idOS} - Nova mensagem`
		case 'taken':
			return `Chamado ${idOS} - assumido!`
		case 'released':
			return `Chamado ${idOS} - colocado em espera`
		case 'close':
			return `Chamado ${idOS} - fechado`
	}
}
/**
 * 
 * @param {EmailTypes} tipo 
 * @param {Object} props 
 */
function getBody(tipo, props) {
	switch(tipo) {
		case 'open':
			return createHTML(open, props)
		case 'message':
			return createHTML(message, props)
		case 'taken':
			return createHTML(taken, props)
		case 'released':
			return createHTML(released, props)
		case 'closed':
			return createHTML(closed, props)
	}
}

/**
 * 
 * @param {*} template 
 * @param {Object} props 
 * @returns 
 */
function createHTML (template, props) {
    let div = document.createElement('div')
	let target = div.attachShadow({mode: 'open'})
	let el = new template({target, props})
	let html = target.innerHTML
	el.$destroy()
	div.remove()
	return html
}