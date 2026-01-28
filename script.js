// This will be populated by scanning the DERM folder
let conditions = [];
let practiceImages = [];
let currentIndex = 0;
let answerVisible = false;

// Base path to your DERM folder
const BASE_PATH = './DERM';

// Folder name to formatted name mapping
const folderNameMap = {
    'AcneVulgaris': 'Acne Vulgaris',
    'ActinicKeratosis': 'Actinic Keratosis',
    'Alopecia': 'Alopecia',
    'AtopicDermatitis': 'Atopic Dermatitis',
    'BCC': 'Basal Cell Carcinoma (BCC)',
    'BullousDisease': 'Bullous Disease',
    'Cellulitis': 'Cellulitis',
    'ContactDermatitis': 'Contact Dermatitis',
    'Dermatofibroma': 'Dermatofibroma',
    'DermatomyositisRash': 'Dermatomyositis Rash',
    'DrugInducedHypersensitivitySyndrome': 'Drug Induced Hypersensitivity Syndrome (DIHS)',
    'Erysipelas': 'Erysipelas',
    'ErythemaMultiforme': 'Erythema Multiforme',
    'ErythemaNodosum': 'Erythema Nodosum',
    'HidradenitisSuppurativa': 'Hidradenitis Suppurativa',
    'HSV': 'Herpes Simplex Virus (HSV)',
    'IchthyosisVulgaris': 'Ichthyosis Vulgaris',
    'Impetigo': 'Impetigo',
    'Langerhans': 'Langerhans Cell Histiocytosis',
    'LichenPlanus': 'Lichen Planus',
    'Mastocytosis-UP': 'Mastocytosis (Urticaria Pigmentosa)',
    'Melanoma': 'Melanoma',
    'Molluscum': 'Molluscum Contagiosum',
    'Mpox': 'Mpox (Monkeypox)',
    'PemphigusVulgaris': 'Pemphigus Vulgaris',
    'PolymorphousLightEruption': 'Polymorphous Light Eruption (PMLE)',
    'Psoriasis': 'Psoriasis',
    'Rosacea': 'Rosacea',
    'SCC': 'Squamous Cell Carcinoma (SCC)',
    'SeborrheicKeratosis': 'Seborrheic Keratosis',
    'SJS-TEN': 'Stevens-Johnson Syndrome / Toxic Epidermal Necrolysis (SJS-TEN)',
    'Urticaria': 'Urticaria',
    'VaricellaZoster': 'Varicella Zoster'
};

// imageFiles will be loaded from imageConfig.js
// Make sure to include <script src="imageConfig.js"></script> in your HTML

// Load folder structure and images
function loadConditions() {
    const folders = Object.keys(folderNameMap);
    
    folders.forEach(folder => {
        const images = imageFiles[folder] || [];
        if (images.length > 0) {
            conditions.push({
                folder: folder,
                name: folderNameMap[folder],
                images: images
            });
        }
    });
    
    // Sort conditions alphabetically by name
    conditions.sort((a, b) => a.name.localeCompare(b.name));
    
    initHome();
}

// Initialize the home screen
function initHome() {
    const conditionList = document.getElementById('conditionList');
    conditionList.innerHTML = '';
    
    if (conditions.length === 0) {
        conditionList.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">No conditions loaded. Please run scan_images.py to generate image configuration.</p>';
        return;
    }
    
    conditions.forEach((condition, index) => {
        const item = document.createElement('div');
        item.className = 'condition-item';
        item.onclick = () => toggleCheckbox(index);
        
        item.innerHTML = `
            <input type="checkbox" id="condition-${index}" onclick="event.stopPropagation()">
            <div class="condition-info">
                <div class="condition-name">${condition.name}</div>
                <div class="condition-count">${condition.images.length} images</div>
            </div>
        `;
        
        conditionList.appendChild(item);
    });
}

function toggleCheckbox(index) {
    const checkbox = document.getElementById(`condition-${index}`);
    checkbox.checked = !checkbox.checked;
}

function selectAll() {
    conditions.forEach((_, index) => {
        document.getElementById(`condition-${index}`).checked = true;
    });
}

function deselectAll() {
    conditions.forEach((_, index) => {
        document.getElementById(`condition-${index}`).checked = false;
    });
}

function startPractice() {
    const selectedConditions = [];
    conditions.forEach((condition, index) => {
        if (document.getElementById(`condition-${index}`).checked) {
            selectedConditions.push(condition);
        }
    });
    
    if (selectedConditions.length === 0) {
        alert('Please select at least one condition to practice.');
        return;
    }
    
    const requestedCount = parseInt(document.getElementById('imageCount').value);
    if (requestedCount < 1) {
        alert('Please enter a valid number of images.');
        return;
    }
    
    // Generate practice images
    practiceImages = generatePracticeSet(selectedConditions, requestedCount);
    
    if (practiceImages.length === 0) {
        alert('No images available for the selected conditions.');
        return;
    }
    
    // Shuffle the practice images
    shuffleArray(practiceImages);
    
    currentIndex = 0;
    answerVisible = false;
    
    // Switch to practice screen
    showScreen('practiceScreen');
    loadImage();
}

function generatePracticeSet(selectedConditions, requestedCount) {
    const images = [];
    const numConditions = selectedConditions.length;

    // Base number per condition
    const baseCount = Math.floor(requestedCount / numConditions);
    let remainder = requestedCount % numConditions;

    // Randomize which conditions get the extra image
    const shuffledConditions = [...selectedConditions];
    shuffleArray(shuffledConditions);

    shuffledConditions.forEach(condition => {
        let count = baseCount;

        if (remainder > 0) {
            count++;
            remainder--;
        }

        // Randomize images within the condition
        const availableImages = [...condition.images];
        shuffleArray(availableImages);

        for (let i = 0; i < Math.min(count, availableImages.length); i++) {
            images.push({
                path: `${BASE_PATH}/${condition.folder}/${availableImages[i]}`,
                condition: condition.name
            });
        }
    });

    // Final shuffle so conditions are mixed
    shuffleArray(images);

    return images;
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadImage() {
    if (currentIndex >= practiceImages.length) {
        showCompletion();
        return;
    }
    
    const image = practiceImages[currentIndex];
    document.getElementById('practiceImage').src = image.path;
    document.getElementById('answerText').textContent = image.condition;
    
    // Hide answer
    document.getElementById('answerText').classList.add('hidden');
    document.getElementById('revealBtn').textContent = 'Reveal';
    answerVisible = false;
    
    // Update progress
    updateProgress();
    
    // Update button states
    document.getElementById('prevBtn').disabled = currentIndex === 0;
}

function updateProgress() {
    const progress = ((currentIndex + 1) / practiceImages.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `${currentIndex + 1} / ${practiceImages.length}`;
}

function toggleAnswer() {
    const answerElement = document.getElementById('answerText');
    const revealBtn = document.getElementById('revealBtn');
    
    if (answerVisible) {
        answerElement.classList.add('hidden');
        revealBtn.textContent = 'Reveal';
        answerVisible = false;
    } else {
        answerElement.classList.remove('hidden');
        revealBtn.textContent = 'Hide';
        answerVisible = true;
    }
}

function previousImage() {
    if (currentIndex > 0) {
        currentIndex--;
        loadImage();
    }
}

function nextImage() {
    if (currentIndex < practiceImages.length - 1) {
        currentIndex++;
        loadImage();
    } else {
        showCompletion();
    }
}

function showCompletion() {
    document.getElementById('completedCount').textContent = practiceImages.length;
    showScreen('completionScreen');
}

function restartPractice() {
    currentIndex = 0;
    shuffleArray(practiceImages);
    showScreen('practiceScreen');
    loadImage();
}

function goHome() {
    showScreen('homeScreen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Initialize on page load
window.onload = () => {
    loadConditions();
};