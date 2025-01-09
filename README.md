# discord-scene

A simple library to implement multi-step conversations ("scenes") and session storage in a Discord bot, **inspired by [Telegraf Scenes](https://github.com/telegraf/telegraf/blob/master/docs/scenes.md)**.

## Features

- **Scene-based workflow**: Define multiple scenes, each with `onEnter`, `onLeave`, and `onMessage` callbacks.  
- **Session storage**: Store and retrieve data for each user. By default, it's in-memory, but you can easily extend it to Redis or a database.  
- **Stage manager**: A central `Stage` that keeps track of user states (which scene they're in, their session data, etc.) and handles transitions between scenes.

## Installation

```bash
npm install discord-scene
```

Below is a minimal example of how to set up a Discord bot using discord-scene. In this scenario, the bot will walk the user through collecting their name and age.

```js

// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const {
  Stage,
  Scene,
  MemorySessionStore,
} = require('discord-scene'); // <-- Import from your library

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 1) Create a session store and a Stage
const sessionStore = new MemorySessionStore();
const stage = new Stage(sessionStore);

// 2) Define a scene
const userInfoScene = new Scene('userInfoScene');

// Called when the user enters the scene
userInfoScene.onEnter(async (ctx) => {
  ctx.sessionData.step = 1;
  await ctx.message.reply('Hello! What is your name?');
});

// Called when the user leaves the scene
userInfoScene.onLeave(async (ctx) => {
  await ctx.message.reply('Leaving the scene. Have a nice day!');
});

// Called for each message while in this scene
userInfoScene.onMessage(async (ctx) => {
  const step = ctx.sessionData.step;

  if (step === 1) {
    ctx.sessionData.name = ctx.message.content.trim();
    ctx.sessionData.step = 2;
    await ctx.message.reply(`Nice to meet you, ${ctx.sessionData.name}! How old are you?`);
    return;
  }

  if (step === 2) {
    const ageNum = parseInt(ctx.message.content.trim(), 10);
    if (isNaN(ageNum)) {
      await ctx.message.reply('Please enter a valid number for your age.');
      return;
    }
    ctx.sessionData.age = ageNum;
    ctx.sessionData.step = 3;
    await ctx.message.reply(
      `So, your name is ${ctx.sessionData.name}, and you are ${ctx.sessionData.age} years old. Is that correct? (yes/no)`
    );
    return;
  }

  if (step === 3) {
    const answer = ctx.message.content.toLowerCase();
    if (answer === 'yes') {
      await ctx.message.reply('Great! Your data has been recorded. Thanks!');
      // Exit the scene
      await stage.enter(null, ctx);
    } else if (answer === 'no') {
      await ctx.message.reply('Let’s start over. Type `!start` again if you want to retry.');
      // Exit the scene
      await stage.enter(null, ctx);
    } else {
      await ctx.message.reply('Please answer "yes" or "no".');
    }
  }
});

// 3) Register the scene
stage.register(userInfoScene);

// 4) Handle Discord messages
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const ctx = {
    message,
    userId: message.author.id,
  };

  // Command to start the scene
  if (message.content === '!start') {
    await stage.enter('userInfoScene', ctx);
    return;
  }

  // Otherwise, let the stage handle the message
  await stage.handleMessage(ctx);
});

client.once('ready', () => {
  console.log(`Bot is ready as ${client.user.tag}`);
});

client.login('YOUR_BOT_TOKEN');
```

1. Replace `YOUR_BOT_TOKEN` with your real token from the Discord Developer Portal.

2. Run the bot:
```bash node index.js```

3. Invite your bot to a server and type !start. You will be guided through a multi-step conversation.

# API Reference

### `MemorySessionStore`
- `getSession(userId)`: Returns the user's session object or null if none exists.
- `setSession(userId, sessionData)`: Saves or updates the session data.
- `deleteSession(userId)`: Removes the session data for the user.

### `class Stage`
Orchestrates scene management and user state.

- Constructor: 

```js
const stage = new Stage(sessionStore);
```

Accepts an instance of a SessionStore.
- `register(...scenes)`: Register one or more `Scene` objects.
- `enter(sceneName, ctx)`: Moves a user to the given scene. If `sceneName` is `null`, the user leaves any current scene.
- `handleMessage(ctx)`: Dispatches the incoming message to the correct scene's `onMessage` callback.

### `class Scene`
Represents a multi-step conversation flow.

Constructor:
```js
const myScene = new Scene('myScene');
```
Takes a *name* for identification.

- `onEnter(fn)`: Registers a callback for when a user enters the scene.
- `onLeave(fn)`: Registers a callback for when a user leaves the scene.
- `onMessage(fn)`: Registers a callback for when the user sends a message in this scene.

All callbacks receive a context object `ctx`:

`ctx.message` - The `Discord.Message` object
`ctx.userId` - The user's Discord ID (`message.author.id`)
`ctx.sessionData` - An object for storing data relevant to the current scene

## Extending

### Custom Session Storage

Create a class that inherits SessionStore and implement getSession, setSession, and deleteSession using your preferred database (e.g., Redis or MongoDB).

### Slash Commands
Instead of messageCreate and !start, you could handle interactionCreate for slash commands in Discord. The logic for Stage and Scene remains the same.

### Multiple Scenes
If you have various flows (e.g., collecting feedback, ordering, or other steps), simply create additional scenes and stage.register(themAll).


## License
MIT – use, modify, and distribute as needed.