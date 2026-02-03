// Music Player Configuration
const musicTracks = [
    { name: "Lễ Đường", file: "musics_cut/Lễ Đường (mp3cut.net).mp3" },
    { name: "50 Năm Về Sau", file: "musics_cut/50 Năm Về Sau (2) (mp3cut.net).mp3" },
    { name: "Dù Một Ngày Hay Trăm Năm", file: "musics_cut/mot ngay hay tram nam (mp3cut.net).mp3" },
    { name: "Nơi Ấy Con Tìm Về", file: "musics_cut/Nơi Ấy Con Tìm Về (mp3cut.net).mp3" },
    { name: "Ngày Chung Đôi", file: "musics_cut/Ngay-Chung-Doi-Van-Mai-Huong (mp3cut.net).mp3" }
];

let currentTrackIndex = 0;
let audio = new Audio();
let isPlaying = false;
let isShuffleOn = false;
let isRepeatOn = false;

// DOM Elements
const floatingMusicBtn = document.getElementById('floatingMusicBtn');
const musicPanel = document.getElementById('musicPanel');
const closePanel = document.getElementById('closePanel');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const songTitle = document.getElementById('songTitle');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playlistItems = document.getElementById('playlistItems');

// Initialize Audio
audio.volume = 0.7;

// Show/Hide Music Panel
function showMusicPanel() {
    musicPanel.classList.add('show');
}

function hideMusicPanel() {
    musicPanel.classList.remove('show');
}

// Format Time (seconds to mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Generate Playlist
function generatePlaylist() {
    playlistItems.innerHTML = '';
    musicTracks.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if (index === currentTrackIndex) {
            item.classList.add('active');
        }
        item.innerHTML = `
            <div class="playlist-item-number">${index + 1}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-name">${track.name}</div>
            </div>
            <div class="playlist-item-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
        `;
        item.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(index);
            playMusic();
            updatePlaylistUI();
        });
        playlistItems.appendChild(item);
    });
}

// Update Playlist UI
function updatePlaylistUI() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Load Track
function loadTrack(index) {
    audio.src = musicTracks[index].file;
    songTitle.textContent = musicTracks[index].name;
    progressFill.style.width = '0%';
    updatePlaylistUI();
}

// Play/Pause Toggle
function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

// Play Music
function playMusic() {
    audio.play().catch(error => {
        console.log('Playback error:', error);
        alert('Không thể phát nhạc. Vui lòng kiểm tra file nhạc trong folder musics/');
    });
    isPlaying = true;
    playPauseBtn.classList.add('playing');
}

// Pause Music
function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playPauseBtn.classList.remove('playing');
}

// Next Track
function nextTrack() {
    if (isShuffleOn) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * musicTracks.length);
        } while (newIndex === currentTrackIndex && musicTracks.length > 1);
        currentTrackIndex = newIndex;
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playMusic();
    }
}

// Previous Track
function previousTrack() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            playMusic();
        }
    }
}

// Toggle Shuffle
function toggleShuffle() {
    isShuffleOn = !isShuffleOn;
    shuffleBtn.classList.toggle('active', isShuffleOn);
}

// Toggle Repeat
function toggleRepeat() {
    isRepeatOn = !isRepeatOn;
    repeatBtn.classList.toggle('active', isRepeatOn);
}

// Update Progress Bar
function updateProgress() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = progressPercent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
}

// Seek on Progress Bar Click
function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audio.duration) {
        audio.currentTime = percent * audio.duration;
    }
}

// Event Listeners
floatingMusicBtn.addEventListener('click', showMusicPanel);
closePanel.addEventListener('click', hideMusicPanel);

// Close panel when clicking backdrop
musicPanel.addEventListener('click', (e) => {
    if (e.target === musicPanel) {
        hideMusicPanel();
    }
});

playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', previousTrack);
nextBtn.addEventListener('click', nextTrack);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
progressBar.addEventListener('click', seek);

audio.addEventListener('timeupdate', updateProgress);

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    if (isRepeatOn) {
        audio.currentTime = 0;
        playMusic();
    } else {
        nextTrack();
    }
});

audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    songTitle.textContent = 'Lỗi khi tải bài hát';
});

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case ' ':
            if (musicPanel.classList.contains('show')) {
                e.preventDefault();
                togglePlay();
            }
            break;
        case 'Escape':
            hideMusicPanel();
            break;
        case 'ArrowRight':
            if (musicPanel.classList.contains('show')) {
                e.preventDefault();
                nextTrack();
            }
            break;
        case 'ArrowLeft':
            if (musicPanel.classList.contains('show')) {
                e.preventDefault();
                previousTrack();
            }
            break;
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generatePlaylist();
    loadTrack(0);
    document.body.style.overflow = 'hidden';

    // Start interval to replay HAPPY WEDDING animation every 30 seconds
    startGreetingAnimation();
});

// Prevent default scroll behavior
window.addEventListener('scroll', (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
}, { passive: false });

// Replay HAPPY WEDDING animation every 30 seconds
function startGreetingAnimation() {
    setInterval(() => {
        const greetingElement = document.getElementById('happyWedding');
        const spans = greetingElement.querySelectorAll('span');

        // Reset all spans
        spans.forEach(span => {
            span.style.animation = 'none';
        });

        // Force reflow
        void greetingElement.offsetWidth;

        // Restart animation
        spans.forEach(span => {
            span.style.animation = '';
        });
    }, 30000); // 30 seconds = 30000ms
}
