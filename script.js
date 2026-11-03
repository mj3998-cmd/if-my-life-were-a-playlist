/* =========================================================
   IF MY LIFE WERE A PLAYLIST - JAVASCRIPT
   Vanilla JavaScript for beginner-friendly customization
   ========================================================= */

// ---------------------------------------------------------
// 1. MEMORY DATA ARCHIVE
// Connected to your uploaded audio files and memory stories!
// ---------------------------------------------------------
const memories = [
  {
    id: 1,
    title: "A New Chapter",
    song: "Welcome to New York",
    artist: "Taylor Swift",
    date: "September 2026",
    description: "The first time I arrived in New York. Everything felt new and unfamiliar. The busy streets, tall buildings, and endless possibilities made me feel both excited and nervous. It was the beginning of a completely new chapter in my life.",
    story: "The first time I arrived in New York. Everything felt new and unfamiliar. The busy streets, tall buildings, and endless possibilities made me feel both excited and nervous. It was the beginning of a completely new chapter in my life.",
    image: "images/photo-1.jpg?v=final",
    audio: "audio/memory-1.wav"
  },
  {
    id: 2,
    title: "Christmas Memories",
    song: "Santa Tell Me",
    artist: "Ariana Grande",
    date: "December",
    description: "Christmas in Korea always felt special. The sparkling lights, familiar streets, Christmas songs, and warm moments with my family made everything feel magical.",
    story: "Christmas in Korea always felt special. The sparkling lights, familiar streets, Christmas songs, and warm moments with my family made everything feel magical.",
    image: "images/photo-2.jpg?v=final",
    audio: "audio/memory-2.wav"
  },
  {
    id: 3,
    title: "Somewhere Only We Know",
    song: "Somewhere Only We Know",
    artist: "Keane",
    date: "A memory from Korea",
    description: "There are places that feel special even when nothing extraordinary happens there. A familiar street, a quiet afternoon, or a place I used to visit often. I didn’t realize how much I would miss these ordinary moments until I left.",
    story: "There are places that feel special even when nothing extraordinary happens there. A familiar street, a quiet afternoon, or a place I used to visit often. I didn’t realize how much I would miss these ordinary moments until I left.",
    image: "images/photo-3.jpg?v=final",
    audio: "audio/memory-3.wav"
  },
  {
    id: 4,
    title: "Summer Never Ends",
    song: "Island in the Sun",
    artist: "Weezer",
    date: "Summer",
    description: "A summer day when I had nowhere to be and nothing to worry about. Just sunshine, laughter, and spending time with people I love.",
    story: "A summer day when I had nowhere to be and nothing to worry about. Just sunshine, laughter, and spending time with people I love.",
    image: "images/photo-4.jpg?v=final",
    audio: "audio/memory-4.wav"
  }
];

// ---------------------------------------------------------
// 2. DOM ELEMENTS
// ---------------------------------------------------------
// Views
const mainView = document.getElementById("main-view");
const detailView = document.getElementById("detail-view");
const recordGrid = document.getElementById("record-grid");
const backBtn = document.getElementById("back-btn");

// Detail Page Elements
const detailAtmosphereImg = document.getElementById("detail-atmosphere-img");
const detailCoverImg = document.getElementById("detail-cover-img");
const detailLabelImg = document.getElementById("detail-label-img");
const detailVinyl = document.getElementById("detail-vinyl");
const detailTrackNum = document.getElementById("detail-track-num");
const detailTitle = document.getElementById("detail-title");
const detailDate = document.getElementById("detail-date");
const detailSong = document.getElementById("detail-song");
const detailArtist = document.getElementById("detail-artist");
const detailStory = document.getElementById("detail-story");

// Playback & Audio
const audioPlayer = document.getElementById("audio-player");
const playbackStatusText = document.getElementById("playback-status-text");
const statusPulse = document.getElementById("status-pulse");
const progressContainer = document.getElementById("progress-container");
const progressFill = document.getElementById("progress-fill");
const timeCurrent = document.getElementById("time-current");
const timeDuration = document.getElementById("time-duration");

// Current active memory
let currentMemory = null;
let isPlaying = false;

// ---------------------------------------------------------
// 3. INITIALIZATION & MAIN PAGE RENDERING
// ---------------------------------------------------------
function init() {
  renderMainGrid();
  attachEventListeners();
}

/**
 * Creates the 4 circular vinyl record cards on the main page
 */
function renderMainGrid() {
  recordGrid.innerHTML = "";

  memories.forEach((memory, index) => {
    // Format track index (e.g., "01")
    const indexStr = String(index + 1).padStart(2, "0");

    // Create record card element
    const card = document.createElement("article");
    card.className = "record-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Open memory: ${memory.title}`);

    card.innerHTML = `
      <div class="vinyl-disc">
        <div class="vinyl-grooves"></div>
        <div class="vinyl-sheen"></div>
        <div class="vinyl-center-label">
          <img src="${memory.image}" alt="${memory.title} label artwork" loading="lazy">
          <div class="spindle-hole"></div>
        </div>
      </div>
      <div class="record-card-info">
        <span class="record-index">Record ${indexStr}</span>
        <h3 class="record-title">${memory.title}</h3>
        <p class="record-song">${memory.song} &bull; ${memory.artist}</p>
      </div>
    `;

    // Click event to navigate to detail page
    card.addEventListener("click", () => openDetailView(memory, index));

    // Keyboard accessibility (Enter or Space key)
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetailView(memory, index);
      }
    });

    recordGrid.appendChild(card);
  });
}

// ---------------------------------------------------------
// 4. DETAIL VIEW LOGIC
// ---------------------------------------------------------

/**
 * Transitions from Main View to Detail View
 */
function openDetailView(memory, index) {
  currentMemory = memory;

  // Make sure any previously playing audio is stopped
  pauseAudio();

  // Populate album artwork & photographs
  detailCoverImg.src = memory.image;
  detailLabelImg.src = memory.image;
  if (detailAtmosphereImg) {
    detailAtmosphereImg.src = memory.image;
  }

  // Populate memory details
  detailTrackNum.textContent = `Record ${String(index + 1).padStart(2, "0")} / 04`;
  detailTitle.textContent = memory.title;
  detailDate.textContent = memory.date;
  detailSong.textContent = memory.song;
  detailArtist.textContent = memory.artist;
  detailStory.textContent = memory.description || memory.story;

  // Prepare audio source (NO AUTOPLAY)
  audioPlayer.src = memory.audio;
  audioPlayer.load();

  // Reset UI status & progress
  resetPlaybackUI();

  // Smooth View Transition
  mainView.classList.remove("active");
  mainView.setAttribute("aria-hidden", "true");

  detailView.classList.add("active");
  detailView.setAttribute("aria-hidden", "false");

  // Scroll smoothly to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Returns back to Main Grid View
 */
function closeDetailView() {
  // Always stop playback when returning to collection
  pauseAudio();

  // Switch views
  detailView.classList.remove("active");
  detailView.setAttribute("aria-hidden", "true");

  mainView.classList.add("active");
  mainView.setAttribute("aria-hidden", "false");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------------------------------------------------------
// 5. MUSIC PLAYBACK & VINYL ROTATION
// ---------------------------------------------------------

/**
 * Toggles music playback and vinyl spinning animation
 */
function toggleMusic() {
  if (!currentMemory) return;

  // Trigger floating musical notes animation on every vinyl click
  triggerFloatingNotes();

  if (audioPlayer.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
}

/**
 * Creates subtle, playful musical notes that float upward and fade away
 */
function triggerFloatingNotes() {
  const container = document.querySelector(".vinyl-disc-wrapper") || detailVinyl;
  if (!container) return;

  const symbols = ["♪", "♫", "♩", "♬", "♭"];
  const count = 5;

  for (let i = 0; i < count; i++) {
    const note = document.createElement("span");
    note.className = "floating-note";
    note.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    // Spread start positions around the center label of the vinyl
    const startX = 35 + Math.random() * 30; // 35% to 65%
    const startY = 35 + Math.random() * 30;

    // Movement: upward float with slight left/right drift and rotation
    const dx = (Math.random() - 0.5) * 80;  // -40px to +40px
    const dy = -(60 + Math.random() * 70); // -60px to -130px upward
    const rot = (Math.random() - 0.5) * 45; // -22deg to +22deg
    const delay = i * 0.05;                // gentle stagger

    note.style.left = `${startX}%`;
    note.style.top = `${startY}%`;
    note.style.setProperty("--note-dx", `${dx}px`);
    note.style.setProperty("--note-dy", `${dy}px`);
    note.style.setProperty("--note-rot", `${rot}deg`);
    note.style.animationDelay = `${delay}s`;

    // Vary font size slightly for visual depth
    const size = 1.2 + Math.random() * 0.5;
    note.style.fontSize = `${size}rem`;

    container.appendChild(note);

    // Clean up DOM after animation completes
    setTimeout(() => {
      note.remove();
    }, 1600);
  }
}

/**
 * Plays audio and starts rotating the vinyl record
 */
function playAudio() {
  audioPlayer.play()
    .then(() => {
      isPlaying = true;
      detailVinyl.classList.add("is-playing");
      detailVinyl.classList.remove("is-paused");

      // Update UI hints
      playbackStatusText.textContent = "Playing — Click vinyl to pause";
      statusPulse.classList.add("playing");
    })
    .catch((err) => {
      console.warn("Audio playback error:", err);
      playbackStatusText.textContent = "Click vinyl to play";
    });
}

/**
 * Pauses audio and stops vinyl rotation
 */
function pauseAudio() {
  if (!audioPlayer.paused) {
    audioPlayer.pause();
  }
  isPlaying = false;
  detailVinyl.classList.remove("is-playing");
  detailVinyl.classList.add("is-paused");

  // Update UI hints
  playbackStatusText.textContent = "Paused — Click vinyl to play";
  statusPulse.classList.remove("playing");
}

/**
 * Resets playback UI when opening a memory
 */
function resetPlaybackUI() {
  isPlaying = false;
  detailVinyl.classList.remove("is-playing");
  detailVinyl.classList.remove("is-paused");
  playbackStatusText.textContent = "Click the vinyl record to play";
  statusPulse.classList.remove("playing");
  progressFill.style.width = "0%";
  timeCurrent.textContent = "0:00";
  timeDuration.textContent = "0:00";
}

/**
 * Formats seconds into MM:SS format
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// ---------------------------------------------------------
// 6. EVENT LISTENERS
// ---------------------------------------------------------
function attachEventListeners() {
  // Back Button
  backBtn.addEventListener("click", closeDetailView);

  // Click on vinyl record in detail view plays/pauses
  detailVinyl.addEventListener("click", toggleMusic);

  // Keyboard accessibility for vinyl
  detailVinyl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMusic();
    }
  });

  // Audio time update (progress bar & time display)
  audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressFill.style.width = `${percent}%`;
      timeCurrent.textContent = formatTime(audioPlayer.currentTime);
    }
  });

  // Audio metadata loaded (update total duration)
  audioPlayer.addEventListener("loadedmetadata", () => {
    timeDuration.textContent = formatTime(audioPlayer.duration);
  });

  // Audio ended (track finished)
  audioPlayer.addEventListener("ended", () => {
    pauseAudio();
    playbackStatusText.textContent = "Finished — Click vinyl to replay";
    progressFill.style.width = "0%";
    timeCurrent.textContent = "0:00";
  });

  // Click on progress bar to seek
  const progressTrack = document.querySelector(".progress-bar-track");
  if (progressTrack) {
    progressTrack.addEventListener("click", (e) => {
      if (!audioPlayer.duration) return;
      const rect = progressTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const fraction = Math.max(0, Math.min(1, clickX / width));
      audioPlayer.currentTime = fraction * audioPlayer.duration;
    });
  }
}

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", init);

