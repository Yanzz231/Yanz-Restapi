const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function toAudio(inputBuffer, extension) {
    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(__dirname, '../tmp', `${Date.now()}.${extension}`);
        const outputFilePath = `${tempFilePath}.mp3`;

        fs.writeFileSync(tempFilePath, inputBuffer);

        const process = spawn('ffmpeg', [
            '-y', '-i', tempFilePath, '-vn', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-f', 'mp3', outputFilePath
        ]);

        process.on('error', (err) => {
            fs.unlinkSync(tempFilePath);
            reject(err);
        });

        process.on('close', () => {
            fs.unlinkSync(tempFilePath);

            if (fs.existsSync(outputFilePath)) {
                const outputBuffer = fs.readFileSync(outputFilePath);
                fs.unlinkSync(outputFilePath);
                resolve(outputBuffer);
            } else {
                reject(new Error('Output file not created'));
            }
        });
    });
}

function toPTT(inputBuffer, extension) {
    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(__dirname, '../tmp', `${Date.now()}.${extension}`);
        const outputFilePath = `${tempFilePath}.opus`;

        fs.writeFileSync(tempFilePath, inputBuffer);

        const process = spawn('ffmpeg', [
            '-y', '-i', tempFilePath, '-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on', '-compression_level', '10', outputFilePath
        ]);

        process.on('error', (err) => {
            fs.unlinkSync(tempFilePath);
            reject(err);
        });

        process.on('close', () => {
            fs.unlinkSync(tempFilePath);

            if (fs.existsSync(outputFilePath)) {
                const outputBuffer = fs.readFileSync(outputFilePath);
                fs.unlinkSync(outputFilePath);
                resolve(outputBuffer);
            } else {
                reject(new Error('Output file not created'));
            }
        });
    });
}

function toVideo(inputBuffer, extension) {
    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(__dirname, '../tmp', `${Date.now()}.${extension}`);
        const outputFilePath = `${tempFilePath}.mp4`;

        fs.writeFileSync(tempFilePath, inputBuffer);

        const process = spawn('ffmpeg', [
            '-y', '-i', tempFilePath, '-c:v', 'libx264', '-crf', '32', '-preset', 'slow', '-c:a', 'aac', '-b:a', '128k', outputFilePath
        ]);

        process.on('error', (err) => {
            fs.unlinkSync(tempFilePath);
            reject(err);
        });

        process.on('close', () => {
            fs.unlinkSync(tempFilePath);

            if (fs.existsSync(outputFilePath)) {
                const outputBuffer = fs.readFileSync(outputFilePath);
                fs.unlinkSync(outputFilePath);
                resolve(outputBuffer);
            } else {
                reject(new Error('Output file not created'));
            }
        });
    });
}

module.exports = {
    toAudio,
    toPTT,
    toVideo
};
