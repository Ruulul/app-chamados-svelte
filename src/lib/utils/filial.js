/**
 * @typedef {Object} Store
 * @property {SubscribeStore} subscribe
 * @property {Function} set
 * @typedef {Function} SubscribeStore
 * @param {Function} subscription
 * @returns {Function} unsubscribe
 */

let filial = '0101'
let filiais_validas = [filial]

/**
 * Store (padrão Observer) que mantém sincronizado as informações atuais da filial,
 * permitindo reatividade assim que ela muda, para quando há valores que dependem disso
 */
const filial_store = {
	/**@type {Array<Function>} Lista de Observers*/
	observers: [],
	/**Adiciona inscrição aos Observers
	 * @param {SubscribeStore} subscription Inscrição. Executar essa função atualiza o Observer.
	 * @returns {Function} Desfazer inscrição. Remove da lista de Observers.
	 */
	subscribe: function (subscription) {
		subscription(filial);
		this.observers.push(subscription)
		return ()=>this.observers.filter(sub=>sub!==subscription)
	},
	/**Notifica todos os Observers registrado */
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