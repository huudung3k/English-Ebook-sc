import { splitTextIntoChunks } from '../../utils';
import { NextResponse } from 'next/server';
const textToSpeech = require('@google-cloud/text-to-speech');

const MAX_CHARS_PER_REQUEST = 200;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

export async function POST(req) {
    const { text } = await req.json()
    if (text) {
        const options = {
            credentials: {
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY
            },
            projectId: "nifty-edge-390410"
        };
        const client = new textToSpeech.TextToSpeechClient(options);
        const chunks = splitTextIntoChunks(text, MAX_CHARS_PER_REQUEST);
        const responses = await Promise.all(
            chunks.map((chunk) =>
                client.synthesizeSpeech({
                    input: { text: chunk },
                    voice: { languageCode: 'en-US', name: 'en-US-Standard-J', ssmlGender: 'MALE' },
                    audioConfig: { audioEncoding: 'MP3' },
                })
            )
        );

        const audioContents = responses
            .map((response) => response[0].audioContent);
        const buffer = Buffer.concat([...audioContents])
        const blob = new Blob([buffer], { type: 'audio/mp3' });

        return new NextResponse(blob, { status: 200, statusText: "OK", headers: { 'Content-Type': 'audio/mp3' } });
    }
}
