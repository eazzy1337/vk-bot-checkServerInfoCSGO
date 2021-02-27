var { VK, Keyboard } = require("vk-io");
var { MessageContext } = require("vk-io");
var mentionRegexp = new RegExp(`\\[ID GROUP\\|(.*)\\]`);
const cfg = require("./cfg.js").cfg;

// Начинаем авторизацию
var vk = new VK({
	token: cfg.group_token,
	apiMode: "parallel_selected",
	pollingGroupId: cfg.group_id,
});

var apiMethod = async (request) => {
	let url = "https://api.vk.me/method/";

	let resource = {
		v: "5.109",
		access_token: options.token,
		group_id: options.pollingGroupId,
		...request.params,
	};
	let response;
	response = await fetch(`${url}${request.method}`, {
		method: "POST",
		compress: false,
		agent: options.agent,
		timeout: options.apiTimeout,
		headers: {
			connection: "keep-alive",
		},
		body: new URLSearchParams(resource),
	});

	response = await response.json();
	console.log(response);
};

async function sendApi(text, params) {
	vk.api.messages.send({
		...(typeof text !== "object"
			? {
					message: text,
					...params,
			  }
			: text),
	});
}
async function send(text, params) {
	sendApi({
		peer_id: this.peerId,
		...(typeof text !== "object"
			? {
					message: text,
					...params,
			  }
			: text),
	});
}

function sendSticker(id) {
	send({ sticker_id: id });
}

module.exports = {
	VK,
	Keyboard,
	mentionRegexp,
	vk,
	atoken,
	apiMethod,
	sendApi,
	send,
	addUser,
	sendSticker,
	MessageContext,
};
