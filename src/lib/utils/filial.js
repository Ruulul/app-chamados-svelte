/**
 * @typedef {Object} Store
 * @property {Array<Function>} observers Array das funções de inscrição, que quando executa, notifica os observers com o valor passado
 * @property {Function} notify Notifica os observers
 * @property {SubscribeStore} subscribe Recebe uma função que é a inscrição, notifica na inscrição, cadastra na lista de observers, e retorna uma função de desinscrição.
 * @property {Function} set
 * @typedef {Function} SubscribeStore
 * @param {Function} subscription Função da inscrição, que ao ser executada, notifica o observer com o valor passado.
 * @returns {Function} unsubscribe
 */
/** Código da filial atual */
let filial = '0101'
/** Lista de filiais válidas para o usuário atual */
let filiais_validas = [filial]

/**
 * @type {Store} (padrão Observer) que mantém sincronizado as informações atuais da filial,
 * permitindo reatividade assim que ela muda, para quando há valores que dependem disso
 */
const filial_store = {
	observers: [],
	subscribe: function subscription (subscription) {
		subscription(filial);
		this.observers.push(subscription)
		return ()=>this.observers.filter(sub=>sub!==subscription)
	},
	notify: function () {
		this.observers.forEach(subscription=>subscription(filial))
	},
	setFilial: function (nova_filial) {
		if (!filiais_validas.includes(nova_filial))
			return;
		filial = nova_filial;
		this.notify();
	}
}

/**
 * @type {Store}
 */
const filial_store_interface = {
	subscribe: filial_store.subscribe.bind(filial_store), 
	set: filial_store.setFilial.bind(filial_store)
}

export {filial_store_interface as filial}

/**
 * @type {Function}
 * Seta uma nova filial para o sistema.
 * @params Código de filial incluso em Filiais Válidas.
 */
const setFilial = filial_store.setFilial.bind(filial_store)
function setFiliaisValidas (filiais) {
    filiais_validas = filiais
}
export {
    setFilial,
    setFiliaisValidas
}