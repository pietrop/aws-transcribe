import { AwsTranscribe, StreamingClient } from "../index"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const recorder = require("node-record-lpcm16")
const sampleRate = 16000
/**
 * You can run this file by running the npm script called example-stream-from-microphone
 * npm run example-stream-from-microphone
 * Ensure sox is installed and accessible from the cli
 * http://sox.sourceforge.net
 */

/******************************************************************************
 * Create AWS transcribe client
 *******************************************************************************/

const client = new AwsTranscribe({
    // if these aren't provided, they will be taken from the environment
    accessKeyId: "ACCESS KEY HERE",
    secretAccessKey: "SECRET KEY HERE",
})

/**
 * Note - currently, transcribe supports the following sample rate with the given languages
 * 8 KHz and 16 KHz
 * US English (en-US)
 * US Spanish (es-US)
 * 8 KHz only
 * Australian English (en-AU)
 * British English (en-GB)
 * French (fr-FR)
 * Canadian French (fr-CA)
 */
const transcribeStream = client
    .createStreamingClient({
        region: "eu-west-1",
        sampleRate,
        languageCode: "en-US",
    })
    // enums for returning the event names which the stream will emit
    .on(StreamingClient.EVENTS.OPEN, () => console.log(`transcribe connection opened`))
    .on(StreamingClient.EVENTS.ERROR, console.error)
    .on(StreamingClient.EVENTS.CLOSE, () => console.log(`transcribe connection opened`))
    .on(StreamingClient.EVENTS.DATA, (data) => {
        const results = data.Transcript.Results

        if (!results || results.length === 0) {
            return
        }

        const result = results[0]
        const final = !result.IsPartial
        const prefix = final ? "recognized" : "recognizing"
        const text = result.Alternatives[0].Transcript
        console.log(`${prefix} text: ${text}`)
    })

/******************************************************************************
 * Start the Recording
 *******************************************************************************/
recorder
    .record({
        sampleRateHertz: sampleRate,
        threshold: 0, //silence threshold
        recordProgram: "sox", // Try also "arecord" or "sox"
        silence: "5.0", //seconds of silence before ending
    })
    .stream()
    .on("error", console.error)
    .pipe(transcribeStream)

/******************************************************************************
 * For closing the transcribe stream
 *******************************************************************************/
process.on("SIGINT", function () {
    // call the destroy method on the transcribe stream to close the socket and end the stream
    console.log("Goodbye")
    transcribeStream.destroy()
    process.exit(0)
})
