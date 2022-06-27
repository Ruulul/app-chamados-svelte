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


const filial_store = new Store({
	get: ()=>filial, 
	isValid: (nova_filial)=>filiais_validas.includes(nova_filial),
	set: (nova_filial)=>filial=nova_filial
})

const filial_store_interface = {
	subscribe	: filial_store.subscribe.bind(filial_store), 
	set			: filial_store.set.bind(filial_store)
}

export {filial_store_interface as filial}

const filiais_validas_store = new Store({
	get: ()=>filiais_validas,
	set: (novas_filiais)=>filiais_validas=novas_filiais
})

const filiais_validas_store_interface = {
	subscribe	: filiais_validas_store.subscribe.bind(filiais_validas_store),
	set			: filiais_validas_store.set.bind(filiais_validas_store)
}

export { filiais_validas_store_interface as filiais_validas }

/**
 * @type {Function}
 * Seta uma nova filial para o sistema.
 * @params Código de filial incluso em Filiais Válidas.
 */
const setFilial = filial_store.set.bind(filial_store)
const setFiliaisValidas = filiais_validas_store.set.bind(filiais_validas_store)
export {
    setFilial,
    setFiliaisValidas
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
function Store ({
	get: getInfo, 
	isValid: isInfoValid, 
	set: setInfo
}) {
	this.observers = []
	this.subscribe = subscribe(getInfo).bind(this)
	this.notify = notify(getInfo).bind(this)
	this.set = set(setInfo, isInfoValid).bind(this)
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
		this.observers.forEach(subscription=>subscription(getInfo()))
	}
}

function set(setInfo, isInfoValid) {
	return function set (newInfo) {
		if (isInfoValid)
			if (!isInfoValid(newInfo))
				return
		setInfo(newInfo)
		this.notify()
	}
}