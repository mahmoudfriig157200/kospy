// State Management using localStorage
const STORAGE_KEYS = {
    PLAYER_ID: 'ff_player_id'
};

// Verified VIP ID List (Only 1146352103 is verified)
const VIP_IDS = ['1146352103'];

// 5 Specific Redeem Codes (Each worth 500 diamonds)
const VALID_CODES = {
    'X154T87763N100': 500,
    'K982M33419Q500': 500,
    'B771X88902Z500': 500,
    'R443P11238V500': 500,
    'L609Y55471W500': 500
};

// Pending Task Data for Instructions Modal
let pendingTaskData = {
    amount: 0,
    url: ''
};

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateDiamondsDisplay();
    setupTabs();
    setupIdValidation();
});

// Helper: Get diamonds for currently logged-in player ID
function getPlayerDiamonds() {
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) return 0;
    return parseInt(localStorage.getItem(`ff_diamonds_${playerId}`) || '0');
}

// Helper: Set diamonds for currently logged-in player ID
function setPlayerDiamonds(amount) {
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) return;
    localStorage.setItem(`ff_diamonds_${playerId}`, amount.toString());
}

// Helper: Get used codes for currently logged-in player ID
function getUsedCodes() {
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) return [];
    try {
        return JSON.parse(localStorage.getItem(`ff_used_codes_${playerId}`) || '[]');
    } catch (e) {
        return [];
    }
}

// Helper: Mark code as used for currently logged-in player ID
function markCodeAsUsed(code) {
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) return;
    const used = getUsedCodes();
    if (!used.includes(code)) {
        used.push(code);
        localStorage.setItem(`ff_used_codes_${playerId}`, JSON.stringify(used));
    }
}

// Update UI based on registration state
function updateAuthUI() {
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    const displayPlayerId = document.getElementById('displayPlayerId');
    const accountStatusLabel = document.getElementById('accountStatusLabel');
    const changeIdBtn = document.getElementById('changeIdBtn');

    if (!playerId) {
        if (accountStatusLabel) {
            accountStatusLabel.innerHTML = 'حالة الحساب: <span class="text-gray-400 font-medium">غير مسجل</span>';
        }
        displayPlayerId.textContent = 'اضغط للتسجيل برقم المعرف';
        displayPlayerId.classList.add('cursor-pointer', 'text-ffOrange', 'underline');
        displayPlayerId.onclick = () => openAuthModal();
        if (changeIdBtn) changeIdBtn.style.display = 'none';
    } else {
        displayPlayerId.classList.remove('cursor-pointer', 'text-ffOrange', 'underline');
        displayPlayerId.onclick = null;
        displayPlayerId.textContent = playerId;

        const isVip = VIP_IDS.includes(playerId);
        if (accountStatusLabel) {
            if (isVip) {
                accountStatusLabel.innerHTML = `حالة الحساب: <span class="text-emerald-400 font-bold inline-flex items-center gap-1">موثق <svg class="w-4 h-4 text-emerald-400 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg></span>`;
            } else {
                accountStatusLabel.innerHTML = `حالة الحساب: <span class="text-gray-300 font-semibold">جديد</span>`;
            }
        }

        if (changeIdBtn) changeIdBtn.style.display = 'inline-flex';
    }
}

// Open Auth Modal
function openAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.classList.remove('hidden');
}

// Close Auth Modal
function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.classList.add('hidden');
}

// Real-time Player ID validation setup
function setupIdValidation() {
    const modalPlayerIdInput = document.getElementById('modalPlayerId');
    if (!modalPlayerIdInput) return;

    modalPlayerIdInput.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = val;

        const errorMsg = document.getElementById('idErrorMessage');

        if (val.length === 0) {
            e.target.className = 'w-full bg-gray-900 border border-gray-700 rounded-xl pr-12 pl-4 py-3 text-white text-sm focus:outline-none transition font-mono tracking-wider';
            if (errorMsg) errorMsg.classList.add('hidden');
        } else if (/^[0-9]{8,20}$/.test(val)) {
            e.target.className = 'w-full bg-gray-900 border-2 border-emerald-500 rounded-xl pr-12 pl-4 py-3 text-emerald-400 text-sm focus:outline-none transition font-mono tracking-wider';
            if (errorMsg) errorMsg.classList.add('hidden');
        } else {
            e.target.className = 'w-full bg-gray-900 border-2 border-red-500 rounded-xl pr-12 pl-4 py-3 text-red-400 text-sm focus:outline-none transition font-mono tracking-wider';
            if (errorMsg) {
                errorMsg.textContent = 'معرف خطأ, ادخل معرف صحيح';
                errorMsg.classList.add('hidden');
            }
        }
    });
}

// Handle Player Registration with validation
function handleRegister(event) {
    event.preventDefault();
    const inputIdInput = document.getElementById('modalPlayerId');
    const inputId = inputIdInput.value.trim();
    const errorMsg = document.getElementById('idErrorMessage');

    const isValidId = /^[0-9]{8,20}$/.test(inputId);

    if (!isValidId) {
        if (errorMsg) {
            errorMsg.textContent = 'معرف خطأ, ادخل معرف صحيح';
            errorMsg.classList.remove('hidden');
        }
        inputIdInput.className = 'w-full bg-gray-900 border-2 border-red-500 rounded-xl pr-12 pl-4 py-3 text-red-400 text-sm focus:outline-none transition font-mono tracking-wider';
        return;
    }

    localStorage.setItem(STORAGE_KEYS.PLAYER_ID, inputId);

    closeAuthModal();
    updateAuthUI();
    updateDiamondsDisplay();
    showToast('تم تسجيل المعرف بنجاح. يمكنك الآن جمع الجواهر.');
}

// Change Player ID Button Handler with Professional Confirmation
const changeIdBtn = document.getElementById('changeIdBtn');
if (changeIdBtn) {
    changeIdBtn.addEventListener('click', () => {
        if (confirm('تنبيه: هل أنت متأكد من رغبتك في تسجيل الخروج من الحساب الحالي؟')) {
            localStorage.removeItem(STORAGE_KEYS.PLAYER_ID);
            document.getElementById('modalPlayerId').value = '';
            updateAuthUI();
            updateDiamondsDisplay();
            showToast('تم تسجيل الخروج بنجاح');
        }
    });
}

// Update Diamonds Display in Header and Modals (Per player ID)
function updateDiamondsDisplay() {
    const diamonds = getPlayerDiamonds();
    const userDiamondsEl = document.getElementById('userDiamonds');
    const modalUserDiamondsEl = document.getElementById('modalUserDiamonds');

    if (userDiamondsEl) userDiamondsEl.textContent = diamonds;
    if (modalUserDiamondsEl) modalUserDiamondsEl.textContent = diamonds;

    // Enable/Disable withdraw button based on minimum threshold (100)
    const withdrawBtn = document.getElementById('confirmWithdrawBtn');
    if (withdrawBtn) {
        if (diamonds >= 100) {
            withdrawBtn.removeAttribute('disabled');
        } else {
            withdrawBtn.setAttribute('disabled', 'true');
        }
    }
}

// Tab Switching Logic
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Reset buttons styling
            tabButtons.forEach(b => {
                b.classList.remove('bg-ffOrange', 'text-white', 'shadow-md', 'shadow-ffOrange/20');
                b.classList.add('text-gray-400', 'hover:text-white');
            });

            // Activate clicked button
            btn.classList.add('bg-ffOrange', 'text-white', 'shadow-md', 'shadow-ffOrange/20');
            btn.classList.remove('text-gray-400', 'hover:text-white');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));

            // Show target tab content
            if (targetTab === 'tasks') {
                document.getElementById('tasksTabContent').classList.remove('hidden');
            } else if (targetTab === 'redeem') {
                document.getElementById('redeemTabContent').classList.remove('hidden');
            }
        });
    });
}

// Open Task Instructions Modal
function openTaskInstructions(amount, url, instructionsArray) {
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) {
        showToast('يرجى تسجيل معرف فري فاير أولاً لتنفيذ المهمة');
        openAuthModal();
        return;
    }

    pendingTaskData = {
        amount,
        url
    };

    const listEl = document.getElementById('taskInstructionsList');
    if (listEl) {
        listEl.innerHTML = instructionsArray.map(item => `<li>${item}</li>`).join('');
    }

    document.getElementById('taskModal').classList.remove('hidden');
}

// Close Task Instructions Modal
function closeTaskModal() {
    document.getElementById('taskModal').classList.add('hidden');
}

// Confirm Start Task ("البدء الان" button)
function confirmStartTask() {
    const { amount, url } = pendingTaskData;
    closeTaskModal();

    if (!url) return;

    // Open offerwall link in new tab
    window.open(url, '_blank');

    // Add diamonds for current player
    let currentDiamonds = getPlayerDiamonds();
    currentDiamonds += amount;
    setPlayerDiamonds(currentDiamonds);

    updateDiamondsDisplay();

    showToast(`تم إضافة +${amount} جوهرة بنجاح لرصيدك`);
}

// Complete Task Function (Requires Auth)
function completeTask(amount) {
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) {
        showToast('يرجى تسجيل معرف فري فاير أولاً لتنفيذ المهمة');
        openAuthModal();
        return;
    }

    let currentDiamonds = getPlayerDiamonds();
    currentDiamonds += amount;
    setPlayerDiamonds(currentDiamonds);

    updateDiamondsDisplay();

    showToast(`تم إضافة +${amount} جوهرة بنجاح لرصيدك`);
}

// Handle Redeem Code Form with single-use check per player ID
function handleRedeem(event) {
    event.preventDefault();
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) {
        showToast('يرجى تسجيل معرف فري فاير أولاً لاسترداد الكود');
        openAuthModal();
        return;
    }

    const codeInput = document.getElementById('codeInput').value.trim().toUpperCase();
    const messageDiv = document.getElementById('redeemMessage');
    messageDiv.classList.remove('hidden');

    if (VALID_CODES[codeInput]) {
        const usedCodes = getUsedCodes();
        if (usedCodes.includes(codeInput)) {
            messageDiv.className = 'mt-3 text-xs font-bold text-center text-red-400';
            messageDiv.textContent = 'لقد قمت باستخدام هذا الكود مسبقاً في حسابك';
            return;
        }

        const reward = VALID_CODES[codeInput];
        let currentDiamonds = getPlayerDiamonds();
        currentDiamonds += reward;
        setPlayerDiamonds(currentDiamonds);
        markCodeAsUsed(codeInput);

        updateDiamondsDisplay();

        messageDiv.classList.add('hidden');
        document.getElementById('codeInput').value = '';

        // Show Redeem Success Modal (500 + diamond icon + checkmark + X close)
        document.getElementById('redeemSuccessModal').classList.remove('hidden');
    } else {
        messageDiv.className = 'mt-3 text-xs font-bold text-center text-red-400';
        messageDiv.textContent = 'الكود غير صحيح أو منتهي الصلاحية';
    }
}

function closeRedeemSuccessModal() {
    document.getElementById('redeemSuccessModal').classList.add('hidden');
}

// Withdraw Modal Actions (Requires Auth)
const openWithdrawModalBtn = document.getElementById('openWithdrawModalBtn');
const withdrawModal = document.getElementById('withdrawModal');

openWithdrawModalBtn.addEventListener('click', () => {
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) {
        showToast('يرجى تسجيل معرف فري فاير أولاً لسحب الجواهر');
        openAuthModal();
        return;
    }
    updateDiamondsDisplay();

    // Set withdraw player ID in destination card
    const withdrawPlayerIdEl = document.getElementById('withdrawPlayerId');
    if (withdrawPlayerIdEl) withdrawPlayerIdEl.textContent = playerId;

    // Reset button state
    const confirmBtn = document.getElementById('confirmWithdrawBtn');
    const btnText = document.getElementById('withdrawBtnText');
    const spinner = document.getElementById('withdrawSpinner');
    if (confirmBtn) confirmBtn.removeAttribute('disabled');
    if (btnText) btnText.textContent = 'تأكيد طلب شحن الجواهر';
    if (spinner) spinner.classList.add('hidden');

    document.getElementById('withdrawContent').classList.remove('hidden');
    document.getElementById('invoiceCard').classList.add('hidden');
    withdrawModal.classList.remove('hidden');
});

function closeWithdrawModal() {
    withdrawModal.classList.add('hidden');
}

// Process Withdrawal with 4-second loading state
function processWithdraw() {
    let currentDiamonds = getPlayerDiamonds();

    if (currentDiamonds < 100) {
        alert('عذراً، الحد الأدنى للسحب هو 100 جوهرة.');
        return;
    }

    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID) || '123456789';
    const confirmBtn = document.getElementById('confirmWithdrawBtn');
    const btnText = document.getElementById('withdrawBtnText');
    const spinner = document.getElementById('withdrawSpinner');

    // Show loading state
    confirmBtn.setAttribute('disabled', 'true');
    if (btnText) btnText.textContent = 'جاري المعالجة...';
    if (spinner) spinner.classList.remove('hidden');

    // Wait 4 seconds then succeed
    setTimeout(() => {
        // Deduct diamonds for current player ID
        setPlayerDiamonds(0);
        updateDiamondsDisplay();

        // Generate Invoice Data
        const txId = '#FF-' + Math.floor(100000 + Math.random() * 900000);
        const now = new Date().toLocaleString('ar-EG');

        document.getElementById('invoiceTxId').textContent = txId;
        document.getElementById('invoicePlayerId').textContent = playerId;
        document.getElementById('invoiceAmount').textContent = `${currentDiamonds} جوهرة`;
        document.getElementById('invoiceDate').textContent = now;

        // Switch view in modal & show toast
        document.getElementById('withdrawContent').classList.add('hidden');
        document.getElementById('invoiceCard').classList.add('hidden');
        showToast('تم إصدار فاتورة الشحن بنجاح');
    }, 4000);
}

// FAQ Accordion Toggle Function
function toggleFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('svg');

    content.classList.toggle('hidden');

    if (content.classList.contains('hidden')) {
        icon.style.transform = 'rotate(0deg)';
    } else {
        icon.style.transform = 'rotate(180deg)';
    }
}

// Helper Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ffCard border border-ffGold/40 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl animate-scale-up flex items-center gap-2';
    toast.innerHTML = `<span>💎</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
