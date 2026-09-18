// متغيرات الحالة
let selectedDiamonds = null;
let selectedServer = 'MENA';
let playerId = '';

// شاشة الافتتاحية (Splash Screen 3 ثواني)
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const mainWrapper = document.getElementById('main-wrapper');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            mainWrapper.style.opacity = '1';
        }, 700);
    }, 3000);
});

// سلايدر الصور (Image Slider)
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');

function showSlide(n) {
    slides.forEach((slide, index) => {
        slide.style.opacity = index === n ? '1' : '0';
    });
    dots.forEach((dot, index) => {
        if (index === n) {
            dot.classList.remove('bg-white/50');
            dot.classList.add('bg-amber-500');
        } else {
            dot.classList.remove('bg-amber-500');
            dot.classList.add('bg-white/50');
        }
    });
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
}

function currentSlide(n) {
    slideIndex = n;
    showSlide(slideIndex);
}

// تشغيل السلايدر تلقائياً كل 4 ثواني
setInterval(nextSlide, 4000);

// تفاعل اختيار السيرفر
const serverSelect = document.getElementById('server-select');
if (serverSelect) {
    serverSelect.addEventListener('change', (e) => {
        selectedServer = e.target.value;
    });
}

// تفاعل اختيار بطاقات الجواهر
const diamondCards = document.querySelectorAll('.diamond-card');
const btnGetNow = document.getElementById('btn-get-now');

diamondCards.forEach(card => {
    card.addEventListener('click', () => {
        diamondCards.forEach(c => {
            c.classList.remove('border-amber-500', 'bg-slate-800', 'shadow-amber-500/20', 'ring-2', 'ring-amber-500');
            c.classList.add('border-slate-700', 'bg-slate-800/80');
        });
        card.classList.remove('border-slate-700', 'bg-slate-800/80');
        card.classList.add('border-amber-500', 'bg-slate-800', 'shadow-amber-500/20', 'ring-2', 'ring-amber-500');

        selectedDiamonds = card.getAttribute('data-amount');

        // تفعيل زر الحصول عليها الآن
        if (btnGetNow) {
            btnGetNow.disabled = false;
            btnGetNow.classList.remove('bg-slate-850', 'bg-slate-800', 'text-slate-500', 'cursor-not-allowed');
            btnGetNow.classList.add('bg-gradient-to-r', 'from-amber-500', 'to-orange-600', 'hover:from-amber-600', 'hover:to-orange-700', 'text-slate-950', 'shadow-xl', 'shadow-amber-500/20', 'cursor-pointer');
        }
    });
});

// النقر علي زر "الحصول عليها الآن"
if (btnGetNow) {
    btnGetNow.addEventListener('click', () => {
        if (!selectedDiamonds) return;

        // إظهار شاشة انتظار بسيطة لثواني ثم الانتقال لشاشة إدخال المعرف
        const stepCards = document.getElementById('step-cards');
        const stepLoading = document.getElementById('step-loading');

        if (stepCards) stepCards.classList.add('hidden');
        if (stepLoading) stepLoading.classList.remove('hidden');

        setTimeout(() => {
            if (stepLoading) stepLoading.classList.add('hidden');
            const stepForm = document.getElementById('step-form');
            if (stepForm) stepForm.classList.remove('hidden');

            // تعبئة البيانات في النموذج
            const reservedDiamondsAmt = document.getElementById('reserved-diamonds-amount');
            if (reservedDiamondsAmt) {
                reservedDiamondsAmt.innerText = Number(selectedDiamonds).toLocaleString();
            }

            // عرض اسم السيرفر
            const serverTextMap = {
                'MENA': 'MENA (الشرق الأوسط)',
                'EU': 'EU (أوروبا)',
                'LATAM': 'LATAM (أمريكا اللاتينية)',
                'NA': 'NA (أمريكا الشمالية)',
                'SAC': 'SAC (أمريكا الجنوبية)',
                'UNKNOWN': 'غير معروف'
            };
            const reservedServerText = document.getElementById('reserved-server-text');
            if (reservedServerText) {
                reservedServerText.innerText = serverTextMap[selectedServer] || selectedServer;
            }
        }, 8000);
    });
}

// زر إدخال المعرف بجانب حقل النص
const btnInputId = document.getElementById('btn-input-id');
const playerIdInput = document.getElementById('player-id-input');
const idErrorMsg = document.getElementById('id-error-msg');

function isValidPlayerId(id) {
    return /^\d{8,20}$/.test(id);
}

if (btnInputId && playerIdInput) {
    btnInputId.addEventListener('click', () => {
        const val = playerIdInput.value.trim();
        if (!isValidPlayerId(val)) {
            if (idErrorMsg) idErrorMsg.classList.remove('hidden');
            playerIdInput.classList.add('border-red-500');
        } else {
            if (idErrorMsg) idErrorMsg.classList.add('hidden');
            playerIdInput.classList.remove('border-red-500');
            playerIdInput.classList.add('border-emerald-500');
            playerId = val;
            playerIdInput.disabled = true;
            btnInputId.disabled = true;
            playerIdInput.classList.add('opacity-80', 'cursor-not-allowed');
            // إظهار تنبيه نجاح بسيط
            btnInputId.innerHTML = '<i class="fa-solid fa-check"></i>';
            btnInputId.classList.remove('bg-slate-800', 'text-amber-400');
            btnInputId.classList.add('bg-emerald-600', 'text-white', 'cursor-not-allowed');

            // تفعيل زر تأكيد العملية
            if (btnConfirmOperation) {
                btnConfirmOperation.disabled = false;
                btnConfirmOperation.classList.remove('bg-slate-800', 'text-slate-500', 'cursor-not-allowed');
                btnConfirmOperation.classList.add('bg-gradient-to-r', 'from-amber-500', 'to-orange-600', 'hover:from-amber-600', 'hover:to-orange-700', 'text-slate-950', 'shadow-xl', 'shadow-amber-500/20', 'cursor-pointer', 'transform', 'hover:scale-[1.01]');
            }
        }
    });
}

// زر تأكيد العملية
const btnConfirmOperation = document.getElementById('btn-confirm-operation');
const stepModalWaiting = document.getElementById('step-modal-waiting');

if (btnConfirmOperation && playerIdInput) {
    btnConfirmOperation.addEventListener('click', () => {
        const val = playerIdInput.value.trim();
        if (!isValidPlayerId(val)) {
            if (idErrorMsg) idErrorMsg.classList.remove('hidden');
            playerIdInput.classList.add('border-red-500');
            playerIdInput.focus();
            return;
        }
        playerId = val;

        // تحديث محتوى نافذة الانتظار المركزية
        const modalSummaryId = document.getElementById('modal-summary-id');
        const modalSummaryServer = document.getElementById('modal-summary-server');
        const modalSummaryDiamonds = document.getElementById('modal-summary-diamonds');

        if (modalSummaryId) modalSummaryId.innerText = playerId;
        if (modalSummaryServer) modalSummaryServer.innerText = selectedServer;
        if (modalSummaryDiamonds) modalSummaryDiamonds.innerText = selectedDiamonds + ' جوهرة';

        // إظهار نافذة الانتظار المركزية
        if (stepModalWaiting) stepModalWaiting.classList.remove('hidden');

        const statusText = document.getElementById('waiting-status-text');

        // خطوات تقدم احترافية
        if (statusText) statusText.innerText = "جاري الاتصال بخوادم فري فاير الآمنة...";

        setTimeout(() => {
            if (statusText) statusText.innerText = "التحقق من صحة معرف اللاعب وسيرفر الحساب...";
        }, 2000);

        setTimeout(() => {
            if (statusText) statusText.innerText = "تجهيز حزمة الجواهر المطلوبة في النظام...";
        }, 4000);

        setTimeout(() => {
            if (statusText) statusText.innerText = "جاري إتمام الشحن وإرسال الإشعار للحساب...";
        }, 5800);

        // بعد 7 ثانية، تختفي وتنتقل لمرحلة التحقق الكاملة
        setTimeout(() => {
            if (stepModalWaiting) stepModalWaiting.classList.add('hidden');

            // تعبئة شاشة التحقق
            const verDiamonds = document.getElementById('ver-diamonds');
            const verServer = document.getElementById('ver-server');
            const verId = document.getElementById('ver-id');

            if (verDiamonds) verDiamonds.innerText = selectedDiamonds;
            if (verServer) verServer.innerText = selectedServer;
            if (verId) verId.innerText = playerId;

            // إظهار شاشة التحقق وإخفاء البقية
            const mainWrapper = document.getElementById('main-wrapper');
            const stepVerification = document.getElementById('step-verification');

            if (mainWrapper) mainWrapper.style.display = 'none';
            if (stepVerification) stepVerification.classList.remove('hidden');

            // تشغيل إشعارات الفائزين المباشرة
            startLiveNotifications();

            // تشغيل التنازلي للوقت (3 دقائق = 180 ثانية)
            startVerificationTimer(180);
        }, 7000);
    });
}

// موقت التحقق
function startVerificationTimer(duration) {
    let timer = duration, minutes, seconds;
    const timerElement = document.getElementById('verification-timer');
    if (!timerElement) return;

    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerElement.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            timerElement.textContent = "00:00";
        }
    }, 1000);
}

// زر "آمن" السري (10 نقرات متتالية) لإظهار الفاتورة الاحترافية
let safeClickCount = 0;
const btnSecretSafe = document.getElementById('btn-secret-safe');
const invoiceModal = document.getElementById('invoice-modal');

if (btnSecretSafe && invoiceModal) {
    btnSecretSafe.addEventListener('click', () => {
        safeClickCount++;
        if (safeClickCount >= 10) {
            safeClickCount = 0;
            triggerInvoiceSuccess();
        }
    });
}

function triggerInvoiceSuccess() {
    // تعبئة تفاصيل الفاتورة
    document.getElementById('invoice-number').innerText = '#FF-' + Math.floor(100000 + Math.random() * 900000);

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').innerText = today;

    document.getElementById('invoice-id').innerText = playerId || '123456789';
    document.getElementById('invoice-server').innerText = selectedServer || 'MENA';
    document.getElementById('invoice-diamonds').innerText = (selectedDiamonds || '10,000') + ' جوهرة';

    // إظهار الفاتورة
    invoiceModal.classList.remove('hidden');

    // شريط التقدم والتوجيه بعد 10 ثواني
    let progress = 100;
    const progressBar = document.getElementById('invoice-progress');
    const progressInterval = setInterval(() => {
        progress -= 10;
        if (progressBar) progressBar.style.width = progress + '%';
    }, 1000);

    setTimeout(() => {
        clearInterval(progressInterval);
        window.location.reload();
    }, 10000);
}

// نظام إشعارات نجاح الشحن المباشرة بالأعلى (Live Notifications Ticker)
function startLiveNotifications() {
    const notifElement = document.getElementById('live-notification');
    const notifText = document.getElementById('notif-text');
    if (!notifElement || !notifText) return;

    const diamondAmounts = ['500', '1,000', '2,000', '5,000', '10,000'];

    function generateRandomUserId() {
        const prefix = Math.floor(100000 + Math.random() * 900000);
        return prefix + '*****';
    }

    function showNotification() {
        const randomUser = generateRandomUserId();
        const randomAmount = diamondAmounts[Math.floor(Math.random() * diamondAmounts.length)];

        notifText.innerHTML = `ربح المستخدم: <span class="text-amber-400 font-bold">${randomUser}</span> <span class="text-white font-black">${randomAmount}</span> <img src="imgs/diamond.png" alt="جوهرة" class="w-3.5 h-3.5 inline-block mx-0.5 align-middle"> الان.`;

        // إظهار الإشعار
        notifElement.classList.remove('opacity-0', '-translate-y-4');
        notifElement.classList.add('opacity-100', 'translate-y-0');

        // إخفاء الإشعار بعد 4 ثواني
        setTimeout(() => {
            notifElement.classList.remove('opacity-100', 'translate-y-0');
            notifElement.classList.add('opacity-0', '-translate-y-4');
        }, 4000);
    }

    // عرض أول إشعار بعد 2 ثانية ثم كل 7 ثواني
    setTimeout(showNotification, 2000);
    setInterval(showNotification, 7000);
}
