import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

const isNative = Capacitor.isNativePlatform();

export const voiceService = {
    isNative,

    async checkPermissions() {
        if (isNative) {
            const { speechRecognition } = await SpeechRecognition.checkPermissions();
            return speechRecognition === 'granted';
        }
        return true; // Web usually requests on usage
    },

    async requestPermissions() {
        if (isNative) {
            const { speechRecognition } = await SpeechRecognition.requestPermissions();
            return speechRecognition === 'granted';
        }
        return true;
    },

    async startRecording(onResult, onError) {
        if (isNative) {
            try {
                const hasPermission = await this.checkPermissions();
                if (!hasPermission) {
                    const granted = await this.requestPermissions();
                    if (!granted) {
                        onError('Permission denied');
                        return;
                    }
                }



                await SpeechRecognition.addListener('partialResults', (data) => {
                    if (data.matches && data.matches.length > 0) {
                        onResult(data.matches[0], false);
                    }
                });

                await SpeechRecognition.start({
                    language: 'te-IN',
                    maxResults: 5,
                    prompt: 'Speak in Telugu',
                    partialResults: true,
                    popup: false,
                });

                // Note: The plugin might not fire 'partialResults' consistently on all devices,
                // so we also rely on 'listeningState' or just the final result if needed.
                // But typically for this plugin:
                // - partialResults event gives interim
                // - no specific 'final' event with text, but we can assume last partial is final when stopped?
                // Actually, let's check the docs pattern.
                // Usually it's better to just listen to partials.
                
            } catch (error) {
                onError(error.message || 'Error starting recognition');
            }
        } else {
            // Web Implementation
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                onError('Speech recognition not supported');
                return;
            }

            const SpeechRecognitionWeb = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognitionWeb();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'te-IN';

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                        onResult(finalTranscript, true);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                        onResult(interimTranscript, false);
                    }
                }
            };

            this.recognition.onerror = (event) => {
                onError(event.error);
            };

            this.recognition.start();
        }
    },

    async stopRecording() {
        if (isNative) {
            await SpeechRecognition.stop();
            await SpeechRecognition.removeAllListeners();
        } else {
            if (this.recognition) {
                this.recognition.stop();
            }
        }
    }
};
