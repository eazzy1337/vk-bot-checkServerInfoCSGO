const commands = [];
const cmds = [];
const cfg = require("./cfg.js").cfg;
var {
	VK,
	mentionRegexp,
	vk,
	apiMethod,
	sendApi,
	send,
	MessageContext,
} = require("./vk.js");
const chalk = require("chalk");
const CSGO = require("csgo-api");
const srv = new CSGO.Server("109.237.111.71", "27022"); //IP AND PORT
var { updates, snippets } = vk;
updates.start().then(() => {});

updates.on("new_message", async (context) => {
	if (context.isOutbox) {
		return;
	}
	userId = context.senderId;
	chatId = context.chatId;
	peerId = context.peerId;
	isChat = context.isChat;
	this.peerId = peerId;

	if (!context.text) return;
	if (context.senderId < 1) return;

	if (mentionRegexp.test(context.text))
		context.text = context.text.replace(mentionRegexp, "").trim();
	if (context.messagePayload && context.messagePayload.command)
		context.text = context.messagePayload.command;
	const command = findCommand(context.text);
	if (!context.user) {
		let [info] = await vk.api.users.get({ user_ids: context.senderId });
	}
	if (!command) {
		if (!context.user) return;
		if (context.isChat) return;
	}

	context.args = context.text.match(command.r) || [];
	try {
		await command.f(context);
	} catch (error) {
		console.error(error);
	}
});
const handlerCmd = (cmd, handler) => {
	let s = [];
	cmds.push({ r: cmd, type: s, f: handler });
};
const findCommand = (text) => {
	for (const command of cmds) {
		if (command.r.test(text)) {
			console.log(chalk.red("NEW message") + chalk.blue(`: ${text}`));
			return command;
		}
	}
	return null;
};
handlerCmd(/^(?:Сервер|Server|Инфа|Информация)$/i, async (context, bot) => {
	const players = await srv.getPlayerCount();
	const serverName = await srv.getServerName();
	const map = await srv.getMap();
	const platform = await srv.getPlatform();
	const maxplayers = await srv.getMaxPlayers();
	const game = await srv.getGame();
	const vac = await srv.getVacEnabled();
	return context.send(`🖥 Сервер: ${serverName}
    🗺 Карта: ${map}
    👥 Онлайн сервера: ${players}/${maxplayers}
    ⚙ Платформа: ${platform}
    🎮 Игра: ${game}
    ${vac
			.toString()
			.replace(/0/gi, "🛡 VAC  защита отсутствует")
			.replace(/1/gi, "🛡 VAC защита присутствует")}
    `);
});
handlerCmd(/^(?:Помощь|Команды|Бот|help)$/i, async (context, bot) => {
	return context.send(`🖥 Сервер - Узнать информацию о сервере
	👥 Онлайн - Узнать информацию о онлайне сервера
    `);
});
handlerCmd(/^(?:Онлайн|Игроки)$/i, async (context, bot) => {
	let query = require("source-server-query"),
		data = await query.players("109.237.111.71", 27022, 1000),
		text = ``,
		decode = require("utf8");
	for (let i of data) {
		text += !i.name
			? `Безмамный | Счет [${i.score}]\n`
			: decode.decode(i.name) + ` | Счет [${i.score}]` + "\n";
	}
	return await context.send(text);
});
