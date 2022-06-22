const SecureToken = "59fa2524-23b0-4dc1-af39-82ac290ca35c"
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
import template_email from '$lib/email_templates/teste.svelte'

export async function sendEmail ({nome, id}) {
    console.log('Props: ', nome, id)
    let email_div = document.createElement('div')
    let email = new template_email({
        target: email_div,
        props: {
            nome
        }
    })
    //Email.send({
    //    SecureToken,
    //    To: from_email,
    //    From: from_email,
    //    Subject: 'Teste antes de load',
    //    Body: email_div.innerHTML,
    //})
    email.$destroy()
    email_div.remove()
}