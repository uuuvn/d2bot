Destiny 2 HUB bot
=================

Этот бот сделан специально для discord сервера и сообщества по Destiny 2 [Destiny 2 HUB](https://discord.gg/nFw7jMN)

Установка на сервер
-------------------

(предпологается что у вас уже установлен nodejs, npm и git)

```bash
git clone https://gitlab.com/d2-group/d2bot.git
cd d2bot
npm install
cp config.json.example config.json
nano config.json (Вставляете свой токен)
npm start
```

Установка на сервер (продвинутая)
-------------------

(предпологается что у вас уже установлен nodejs, npm, pm2 и git)

```bash
git clone https://gitlab.com/d2-group/d2bot.git
cd d2bot
npm install
cp config.json.example config.json
nano config.json (Вставляете свой токен)
pm2 start startup.js
```
