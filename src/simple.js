const fs = require('fs');
const util = require('util');
const path = require('path');
const FileType = require('file-type');
const fetch = require('node-fetch');
const PhoneNumber = require('awesome-phonenumber');
const { MessageType } = require('@adiwajshing/baileys');
const { toAudio, toPTT, toVideo } = require('./converter');

exports.wrapApi = (BaseClass) => {
    class EnhancedApi extends BaseClass {
        constructor(...args) {
            super(...args);
            this.on('message-new', (message) => {
                const messageType = message.messageStubType;
                const participants = message.participant;

                switch (messageType) {
                    case 27: // Group add
                    case 31: // Group invite
                        this.emit('group-add', { message, type: messageType, participants });
                        break;
                    case 28: // Group remove
                    case 32: // Group leave
                        this.emit('group-leave', { message, type: messageType, participants });
                        break;
                }
            });
        }

        async sendFile(chatId, filePath, filename = '', caption = '', quoted = null, options = {}) {
            const fileData = await this.getFile(filePath);
            const messageType = this.getMessageType(fileData.mime, options);

            const messageOptions = {
                caption,
                filename,
                ...options,
            };

            if (quoted) {
                messageOptions.quoted = quoted;
            }

            return await this.sendMessage(chatId, fileData.data, messageType, messageOptions);
        }

        async getFile(filePath) {
            let fileBuffer;
            if (Buffer.isBuffer(filePath)) {
                fileBuffer = filePath;
            } else if (/^https?:\/\//.test(filePath)) {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error('Failed to fetch file');
                fileBuffer = await response.buffer();
            } else {
                fileBuffer = fs.readFileSync(filePath);
            }

            const fileType = await FileType.fromBuffer(fileBuffer) || { mime: 'application/octet-stream', ext: 'bin' };
            return { data: fileBuffer, ...fileType };
        }

        getMessageType(mimeType, options) {
            if (options.asDocument) {
                return MessageType.document;
            } else if (/image/.test(mimeType)) {
                return MessageType.image;
            } else if (/video/.test(mimeType)) {
                return MessageType.video;
            } else if (/audio/.test(mimeType)) {
                return options.ptt ? MessageType.audio : MessageType.ptt;
            } else {
                return MessageType.document;
            }
        }

        async downloadMediaMessage(message) {
            if (!message.message) throw new Error('No media message found');

            const messageType = Object.keys(message.message)[0];
            const mediaMessage = message.message[messageType];

            if (!mediaMessage.url) throw new Error('Media message URL not found');

            const mediaBuffer = await fetch(mediaMessage.url).then((res) => res.buffer());
            return mediaBuffer;
        }
    }

    return EnhancedApi;
};
