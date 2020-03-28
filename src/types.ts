export type AVAILABLE_REGIONS =
    | "us-east-1"
    | "us-east-2"
    | "us-west-2"
    | "ap-southeast-2"
    | "ca-central-1"
    | "eu-west-1"

/**
 * 8 KHz and 16 KHz
 * US English (en-US)
 * US Spanish (es-US)
 * 8 KHz only
 * Australian English (en-AU)
 * British English (en-GB)
 * French (fr-FR)
 * Canadian French (fr-CA)
 */
export type LANGUAGES = "en-US" | "en-AU" | "en-GB" | "fr-CA" | "fr-FR" | "es-US"

export interface ClientConfig {
    accessKeyId?: string
    secretAccessKey?: string
}

export interface TranscribeStreamConfig {
    region: AVAILABLE_REGIONS
    languageCode: LANGUAGES
    sampleRate: number
}

export interface AwsEventMessage {
    headers: {
        ":message-type": {
            type: string
            value: string
        }
        ":event-type": {
            type: string
            value: string
        }
    }
    body: Buffer
}
