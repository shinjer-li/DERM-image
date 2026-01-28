// Condition data - Update this with your actual folder structure and image counts
const conditions = [
    { folder: "AcneVulgaris", name: "Acne Vulgaris", imageCount: 8 },
    { folder: "ActinicKeratosis", name: "Actinic Keratosis", imageCount: 7 },
    { folder: "Alopecia", name: "Alopecia", imageCount: 6 },
    { folder: "AtopicDermatitis", name: "Atopic Dermatitis", imageCount: 9 },
    { folder: "BCC", name: "Basal Cell Carcinoma (BCC)", imageCount: 10 },
    { folder: "BullousDisease", name: "Bullous Disease", imageCount: 7 },
    { folder: "Cellulitis", name: "Cellulitis", imageCount: 8 },
    { folder: "ContactDermatitis", name: "Contact Dermatitis", imageCount: 6 },
    { folder: "Dermatofibroma", name: "Dermatofibroma", imageCount: 6 },
    { folder: "DermatomyositisRash", name: "Dermatomyositis Rash", imageCount: 8 },
    { folder: "DrugInducedHypersensitivitySyndrome", name: "Drug Induced Hypersensitivity Syndrome (DIHS)", imageCount: 7 },
    { folder: "Erysipelas", name: "Erysipelas", imageCount: 6 },
    { folder: "ErythemaMultiforme", name: "Erythema Multiforme", imageCount: 8 },
    { folder: "ErythemaNodosum", name: "Erythema Nodosum", imageCount: 7 },
    { folder: "HidradenitisSuppurativa", name: "Hidradenitis Suppurativa", imageCount: 9 },
    { folder: "HSV", name: "Herpes Simplex Virus (HSV)", imageCount: 8 },
    { folder: "IchthyosisVulgaris", name: "Ichthyosis Vulgaris", imageCount: 6 },
    { folder: "Impetigo", name: "Impetigo", imageCount: 7 },
    { folder: "Langerhans", name: "Langerhans Cell Histiocytosis", imageCount: 6 },
    { folder: "LichenPlanus", name: "Lichen Planus", imageCount: 8 },
    { folder: "Mastocytosis-UP", name: "Mastocytosis (Urticaria Pigmentosa)", imageCount: 7 },
    { folder: "Melanoma", name: "Melanoma", imageCount: 10 },
    { folder: "Molluscum", name: "Molluscum Contagiosum", imageCount: 8 },
    { folder: "Mpox", name: "Mpox (Monkeypox)", imageCount: 7 },
    { folder: "PemphigusVulgaris", name: "Pemphigus Vulgaris", imageCount: 8 },
    { folder: "PolymorphousLightEruption", name: "Polymorphous Light Eruption (PMLE)", imageCount: 7 },
    { folder: "Psoriasis", name: "Psoriasis", imageCount: 9 },
    { folder: "Rosacea", name: "Rosacea", imageCount: 8 },
    { folder: "SCC", name: "Squamous Cell Carcinoma (SCC)", imageCount: 9 },
    { folder: "SeborrheicKeratosis", name: "Seborrheic Keratosis", imageCount: 7 },
    { folder: "SJS-TEN", name: "Stevens-Johnson Syndrome / Toxic Epidermal Necrolysis (SJS-TEN)", imageCount: 8 },
    { folder: "Urticaria", name: "Urticaria", imageCount: 7 },
    { folder: "VaricellaZoster", name: "Varicella Zoster", imageCount: 8 }
];

let practiceImages = [];
let currentIndex = 0;
let answerVisible = false;

// Initialize the home screen
function initHome() {
    const conditionList = document.getElementById('conditionList');
    conditionList.innerHTML = '';
    
    conditions.forEach((condition, index) => {
        const item = document.createElement('div');
        item.className = 'condition-item';
        item.onclick = () => toggleCheckbox(index);
        
        item.innerHTML = `
            <input type="checkbox" id="condition-${index}" onclick="event.stopPropagation()">
            <div class="condition-info">
                <div class="condition-name">${condition.name}</div>
                <div class="condition-count">${condition.imageCount} images</div>
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
    
    // Calculate total available images
    const totalAvailable = selectedConditions.reduce((sum, c) => sum + c.imageCount, 0);
    
    if (requestedCount >= totalAvailable) {
        // Use all images from all selected conditions
        selectedConditions.forEach(condition => {
            for (let i = 1; i <= condition.imageCount; i++) {
                images.push({
                    path: `C:/Users/lijer/Downloads/DERM/${condition.folder}/image${i}.jpg`,
                    condition: condition.name
                });
            }
        });
    } else {
        // Randomly select images from each condition
        const imagesPerCondition = Math.floor(requestedCount / selectedConditions.length);
        let remaining = requestedCount % selectedConditions.length;
        
        selectedConditions.forEach(condition => {
            let count = imagesPerCondition;
            if (remaining > 0) {
                count++;
                remaining--;
            }
            
            // Get random images from this condition
            const availableIndices = Array.from({ length: condition.imageCount }, (_, i) => i + 1);
            shuffleArray(availableIndices);
            
            for (let i = 0; i < Math.min(count, condition.imageCount); i++) {
                images.push({
                    path: `C:/Users/lijer/Downloads/DERM/${condition.folder}/image${availableIndices[i]}.jpg`,
                    condition: condition.name
                });
            }
        });
    }
    
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
window.onload = initHome;