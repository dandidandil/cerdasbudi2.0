class CerdasBudiChat {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordingTimer = null;
        this.recordingDuration = 0;
        this.audioBlob = null;
        
        // User info from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.userName = urlParams.get('name');
        this.userAge = urlParams.get('age');
        this.userGender = urlParams.get('gender');
        
        // Initialize with API key prompt
        this.loadApiKey();
    }

    initializeElements() {
        // Chat elements
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.recordButton = document.getElementById('record-button');

        // Voice recording elements
        this.voiceRecordingStatus = document.getElementById('voice-recording-status');
        this.recordingTimerDisplay = document.getElementById('recording-timer');
        this.stopRecordingButton = document.getElementById('stop-recording');

        // Voice playback elements
        this.voicePlaybackPreview = document.getElementById('voice-playback-preview');
        this.playPausePreview = document.getElementById('play-pause-preview');
        this.playbackProgress = document.getElementById('playback-progress');
        this.audioDuration = document.getElementById('audio-duration');
        this.sendVoiceMessageButton = document.getElementById('send-voice-message');
        this.cancelVoiceMessageButton = document.getElementById('cancel-voice-message');

        // Other buttons
        this.newChatBtn = document.getElementById('new-chat-btn');
        this.endChatBtn = document.getElementById('end-chat-btn');

        // Audio elements
        this.audioPreview = new Audio();
    }

    initializeEventListeners() {
        // Send text message
        this.sendButton.addEventListener('click', () => this.sendTextMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendTextMessage();
        });

        // Voice recording listeners
        this.recordButton.addEventListener('click', () => this.startRecording());
        this.stopRecordingButton.addEventListener('click', () => this.stopRecording());

        // Voice playback listeners
        this.playPausePreview.addEventListener('click', () => this.toggleAudioPreview());
        this.sendVoiceMessageButton.addEventListener('click', () => this.sendVoiceMessage());
        this.cancelVoiceMessageButton.addEventListener('click', () => this.cancelVoiceMessage());
        this.audioPreview.addEventListener('timeupdate', () => this.updateAudioPreviewProgress());
        this.audioPreview.addEventListener('ended', () => this.resetAudioPreview());

        // Chat management buttons
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
        this.endChatBtn.addEventListener('click', () => this.endChat());
    }

    async loadApiKey() {
        const storedApiKey = localStorage.getItem('apiKey');
        if (storedApiKey) {
            this.apiKey = storedApiKey;
            this.initializeChat();
        } else {
            await this.promptForApiKey();
        }
    }

    async promptForApiKey() {
        const result = await Swal.fire({
            icon: 'info',
            title: 'API Key Diperlukan',
            html: `
                <p>Silakan masukkan API key Anda:</p>
                <ol class="text-left mt-4 mb-4">
                    <li>1. Kunjungi <a href="https://console.groq.com/keys" target="_blank" class="text-blue-500 hover:underline">Groq Console</a></li>
                    <li>2. Buat API key baru</li>
                    <li>3. Salin API key yang dihasilkan</li>
                    <li>4. Tempel API key tersebut di bawah ini</li>
                </ol>
            `,
            input: 'text',
            inputPlaceholder: 'Tempel API key Anda di sini',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Anda perlu memasukkan API key!';
                }
            }
        });

        if (result.isConfirmed) {
            this.apiKey = result.value;
            localStorage.setItem('apiKey', this.apiKey);
            this.initializeChat();
        }
    }

    initializeChat() {
        // Add initial greeting
        this.addMessage(`Halo ${this.userName}! Saya CerdasBudi, psikolog AI Anda. Bagaimana perasaan Anda hari ini? Apa yang ingin Anda bicarakan?`, 'bot');
    }

    startNewChat() {
        this.chatMessages.innerHTML = '';
        this.initializeChat();
    }

    endChat() {
        Swal.fire({
            title: 'Akhiri Percakapan?',
            text: "Anda yakin ingin mengakhiri percakapan ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Akhiri',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'index.html';
            }
        });
    }

    addMessage(content, type, transcription = null, audioUrl = null) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('flex', 'items-start', 'space-x-4', 'mb-4');
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('flex-shrink-0', 'w-10', 'h-10', 'rounded-full', 'overflow-hidden');
        
        const avatarImg = document.createElement('img');
        avatarImg.src = type === 'user' ? 'assets/user.png' : 'assets/aiuserr.png';
        avatarImg.alt = type === 'user' ? 'User Avatar' : 'AI Avatar';
        avatarImg.classList.add('w-full', 'h-full', 'object-cover');
        
        avatarDiv.appendChild(avatarImg);
        messageContainer.appendChild(avatarDiv);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('flex-grow');
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('bg-card', 'p-4', 'rounded-lg', 'shadow', 'relative', 'chat-bubble', 'break-words');
        
        if (type === 'user') {
            bubbleDiv.classList.add('bg-primary', 'text-white');
        } else {
            bubbleDiv.classList.add('bg-secondary', 'text-white');
        }
        
        bubbleDiv.innerHTML = content;

        // Add TTS button for AI messages
        if (type === 'bot') {
            const ttsButton = document.createElement('button');
            ttsButton.classList.add('tts-button');
            ttsButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            ttsButton.addEventListener('click', () => this.playTTS(content));
            bubbleDiv.appendChild(ttsButton);
        }

        // Add transcription and audio playback for voice messages
        if (transcription) {
            const transcriptionDiv = document.createElement('div');
            transcriptionDiv.classList.add('text-xs', 'text-gray-300', 'mt-2');
            transcriptionDiv.textContent = `Transkripsi: ${transcription}`;
            bubbleDiv.appendChild(transcriptionDiv);
        }

        if (audioUrl) {
            const audioPlayer = document.createElement('audio');
            audioPlayer.src = audioUrl;
            audioPlayer.controls = true;
            audioPlayer.classList.add('mt-2', 'w-full');
            bubbleDiv.appendChild(audioPlayer);
        }

        contentDiv.appendChild(bubbleDiv);
        messageContainer.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageContainer);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    async sendTextMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.userInput.value = '';

        try {
            const botResponse = await this.processWithCerdasBudi(message);
            this.addMessage(botResponse, 'bot');
        } catch (error) {
            this.addMessage('Maaf, terjadi kesalahan. Coba lagi nanti.', 'bot');
            console.error(error);
        }
    }

    // Voice recording methods
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.recordingDuration = 0;

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => this.prepareVoiceMessagePreview();

            this.mediaRecorder.start();
            this.recordButton.classList.add('hidden');
            this.voiceRecordingStatus.classList.remove('hidden');
            this.startRecordingTimer();
        } catch (err) {
            alert('Tidak dapat mengakses mikrofon: ' + err);
        }
    }

    startRecordingTimer() {
        this.recordingTimer = setInterval(() => {
            this.recordingDuration++;
            const minutes = Math.floor(this.recordingDuration / 60);
            const seconds = this.recordingDuration % 60;
            this.recordingTimerDisplay.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopRecording() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            clearInterval(this.recordingTimer);
            this.voiceRecordingStatus.classList.add('hidden');
        }
    }

    prepareVoiceMessagePreview() {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(this.audioBlob);
        this.audioPreview.src = audioUrl;

        // Set audio duration
        this.audioPreview.onloadedmetadata = () => {
            const duration = Math.floor(this.audioPreview.duration);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            this.audioDuration.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        this.recordButton.classList.add('hidden');
        this.voicePlaybackPreview.classList.remove('hidden');
    }

    toggleAudioPreview() {
        if (this.audioPreview.paused) {
            this.audioPreview.play();
            this.playPausePreview.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            this.audioPreview.pause();
            this.playPausePreview.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    updateAudioPreviewProgress() {
        const progress = (this.audioPreview.currentTime / this.audioPreview.duration) * 100;
        this.playbackProgress.style.width = `${progress}%`;
    }

    resetAudioPreview() {
        this.playPausePreview.innerHTML = '<i class="fas fa-play"></i>';
        this.playbackProgress.style.width = '0%';
    }

    async sendVoiceMessage() {
        const file = new File([this.audioBlob], 'recording.webm', { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(this.audioBlob);

        // Add voice message to chat
        this.addMessage('Rekaman suara', 'user', null, audioUrl);
        this.voicePlaybackPreview.classList.add('hidden');
        this.recordButton.classList.remove('hidden');

        try {
            const whisperResponse = await this.transcribeWithWhisper(file);
            const botResponse = await this.processWithCerdasBudi(whisperResponse);
            
            // Add bot response
            this.addMessage(botResponse, 'bot', whisperResponse);
        } catch (error) {
            this.addMessage('Maaf, terjadi kesalahan dalam memproses rekaman.', 'bot');
            console.error(error);
        }
    }

    cancelVoiceMessage() {
        this.voicePlaybackPreview.classList.add('hidden');
        this.recordButton.classList.remove('hidden');
        this.audioPreview.pause();
        this.audioPreview.currentTime = 0;
    }

    async playTTS(text) {
        const ttsButton = event.target.closest('.tts-button');
        const originalContent = ttsButton.innerHTML;
        ttsButton.innerHTML = '<div class="tts-loader"></div>';
        ttsButton.disabled = true;

        try {
            const response = await fetch(`https://api.nyxs.pw/tools/tts?text=${encodeURIComponent(text)}&to=id`);
            const data = await response.json();

            if (data.status) {
                const audio = new Audio(data.result);
                audio.play();
                audio.onended = () => {
                    ttsButton.innerHTML = originalContent;
                    ttsButton.disabled = false;
                };
            } else {
                throw new Error('TTS generation failed');
            }
        } catch (error) {
            console.error('Error generating TTS:', error);
            Swal.fire({
                icon: 'error',
                title: 'TTS Error',
                text: 'Terjadi kesalahan saat menghasilkan audio. Silakan coba lagi.',
            });
            ttsButton.innerHTML = originalContent;
            ttsButton.disabled = false;
        }
    }

    async transcribeWithWhisper(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', 'whisper-large-v3');
        formData.append('language', 'id');
        formData.append('response_format', 'verbose_json');

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Transkripsi gagal');
        }

        const data = await response.json();
        return data.text;
    }

    async processWithCerdasBudi(transcription) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system", 
                        content: `Kamu adalah CerdasBudi, AI psikolog yang bertugas fokus untuk menangani korban perundungan atau bullying, biasanya yang sering dialami oleh korban perundungan adalah trauma,depresi,anti sosial, malu, tidak percaya diri, merasa hidupnya sendiri, sulit berbicara didepan banyak orang,sulit presentasi, bahkan sering ada ide untuk bunuh diri. 

Tugasmu adalah:
1. Memahami latar belakang mereka.
2. Menganalisis suasana hati dan emosi mereka berdasarkan percakapan.
3. Memberikan saran yang valid dan bisa diterapkan.
4. Memberikan dukungan emosional jika diperlukan.
5. Memberikan step by step pemulihan dari setiap keluhan mereka
6. Selalu merespon dengan semangat dan empati setiap ada perubahan atau peningkatan dari diri mereka
7. Tidak langsung menjawab dalam satu kali respon, tetapi bertanya lebih dalam sebelum menyimpulkan.
8. Kamu bisa tanya detail tentang cerita dan keluhan mereka sebelum menyimpulkan
9. Berikan saran yang dapat langsung dicoba dan diterapkan
10. Berikan respon dalam bahasa indonesia gaul yang mengasyikkan seakan kamu sudah dekat dengannya dengan tetap ada kode etik

Profil Pengguna:
Nama: ${this.userName}
Usia: ${this.userAge}
Jenis Kelamin: ${this.userGender}

Kamu akan menerima transkripsi atau pesan dari pengguna. Analisis dengan sangat hati-hati dan empati.`
                    },
                    {
                        role: "user", 
                        content: transcription
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            throw new Error('Analisis dengan CerdasBudi gagal');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// Inisialisasi aplikasi
new CerdasBudiChat();