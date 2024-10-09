import {IUser} from "../types.ts";

import EchoBotImg from './../assets/img/botIcons/bot_1.png'
import ReverseBotImg from './../assets/img/botIcons/bot_2.png'
import SpamBotImg from './../assets/img/botIcons/bot_3.png'
import IgnoreBotImg from './../assets/img/botIcons/bot_4.png'


type TBotsConfig = IUser[]

export const botsConfig: TBotsConfig = [
    {
        uid: 'Echo_bot',
        name: 'Echo bot',
        email: 'Echo_bot',
        isOnline: true,
        avatar: EchoBotImg,
        avatarPath: "",
        description: "Replies to any message with the same message.",
        password: '123456'
    },
    {
        uid: 'Reverse_bot',
        name: 'Reverse bot',
        email: 'Reverse_bot',
        isOnline: true,
        avatar: ReverseBotImg,
        avatarPath: "",
        description: " Replies to any message with the same message but reversed. Example: abc -> cba. THIS BOT HAS A RESPONSE DELAY OF 3 SECONDS.",
        password: '123456'
    },
    {
        uid: 'Spam_bot',
        name: 'Spam bot',
        email: 'Spam_bot',
        isOnline: true,
        avatar: SpamBotImg,
        avatarPath: "",
        description: "Ignores everything you write to it. Every 10-120 seconds (the duration is random each time), sends a message in the chat.",
        password: '123456'
    },
    {
        uid: 'Ignore_bot',
        name: 'Ignore bot',
        email: 'Ignore_bot',
        isOnline: true,
        avatar: IgnoreBotImg,
        avatarPath: "",
        description: "Simply ignores everything, writes nothing.",
        password: '123456'
    },
]
