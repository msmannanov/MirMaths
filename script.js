// 1. SUPABASE КОНФИГУРАЦИЯСЫ
const SUPABASE_URL = 'https://iugnskwqgobuwxabqbnf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Сиздин толук ачкычыңыз
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. КОТОРМОЛОР
const translations = {
    'kg': {
        'main-title': 'БИЛИМ ПЛАТФОРМАСЫ',
        'sub-title': 'Сапаттуу билим — ийгиликтин ачкычы',
        'nav-math': 'Математика',
        'nav-history': 'Тарых',
        'nav-geo': 'География',
        'nav-it': 'Информатика',
        'ai-btn': '🔊 Сабакты угуу',
        'welcome-title': 'Кош келиңиздер!',
        'welcome-desc': 'Биздин портал аркылуу сиз эң керектүү илимдерди акысыз жана кызыктуу түрдө үйрөнө аласыз.',
        'card-books': 'Китептер',
        'desc-books': 'Биздин бардык электрондук китептер ушул жерде.',
        'btn-books': 'Китепканага кирүү',
        'card-tests': 'Тесттер',
        'desc-tests': 'Өз билимиңизди текшериңиз.',
        'btn-tests': 'Тестти баштоо',
        'card-video': 'Видео сабактар',
        'desc-video': 'Тажрыйбалуу мугалимдерден видео түшүндүрмөлөр.',
        'btn-video': 'Видеолорду көрүү',
        'footer-text': '© 2026 Билим Платформасы'
    },
    'ru': {
        'main-title': 'ОБРАЗОВАТЕЛЬНАЯ ПЛАТФОРМА',
        'sub-title': 'Качественное образование — ключ к успеху',
        'nav-math': 'Математика',
        'nav-history': 'История',
        'nav-geo': 'География',
        'nav-it': 'Информатика',
        'ai-btn': '🔊 Слушать урок',
        'welcome-title': 'Добро пожаловать!',
        'welcome-desc': 'Через наш портал вы можете обучаться самым необходимым наукам бесплатно и интересно.',
        'card-books': 'Книги',
        'desc-books': 'Все наши электронные книги здесь.',
        'btn-books': 'Войти в библиотеку',
        'card-tests': 'Тесты',
        'desc-tests': 'Проверьте свои знания.',
        'btn-tests': 'Начать тест',
        'card-video': 'Видео уроки',
        'desc-video': 'Видео объяснения от опытных учителей.',
        'btn-video': 'Смотреть видео',
        'footer-text': '© 2026 Образовательная Платформа'
    }
};

// 3. БАРАКЧАЛАРДЫ КОРГОО
async function checkAccess() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const protectedPages = ['matematika', 'taryh', 'geografiya', 'informatika', 'math-hard'];
    const currentURL = window.location.href;

    const isProtected = protectedPages.some(page => currentURL.includes(page));

    if (isProtected && !user) {
        alert("Бул бөлүмдү көрүү үчүн алгач сайтка кириңиз!");
        window.location.href = "auth.html";
    }
}

// 4. ТИЛ ЖАНА КУТТУКТОО
function changeLang(lang) {
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
    dynamicGreeting(); // Тил алмашса, куттуктоо да дароо алмашат
}

function dynamicGreeting() {
    const hour = new Date().getHours();
    const lang = document.documentElement.lang || 'kg';
    let message = "";

    const greetings = {
        'kg': {
            morning: "Кутман таң! Окууга даярсызбы? 👋",
            day: "Кутман күн! Билим алууну улантабыз! 📚",
            evening: "Кутман кеч! Бүгүнкү ийгиликтериңиз кандай? ✨"
        },
        'ru': {
            morning: "Доброе утро! Готовы к учебе? 👋",
            day: "Добрый день! Продолжаем учиться! 📚",
            evening: "Добрый вечер! Как ваши успехи сегодня? ✨"
        }
    };

    const currentG = greetings[lang];
    if (hour < 12) message = currentG.morning;
    else if (hour < 18) message = currentG.day;
    else message = currentG.evening;

    const welcomeEl = document.querySelector('[data-key="welcome-desc"]');
    if (welcomeEl) welcomeEl.innerText = message;
}

// 5. ҮН МЕНЕН ОКУУ (AI)
function speakText() {
    window.speechSynthesis.cancel(); // Эски үн өчүрүлөт
    const text = document.querySelector('.hero').innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Тилге жараша үндү тууралоо
    utterance.lang = document.documentElement.lang === 'kg' ? 'tr-TR' : 'ru-RU';
    utterance.rate = 0.9; // Бир аз жайыраак окуу
    window.speechSynthesis.speak(utterance);
}

// 6. ПИКИРЛЕР (Load & Send)
async function loadComments() {
    const { data, error } = await supabaseClient
        .from('site_comments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return;

    const list = document.getElementById('comments-list');
    if (list) {
        list.innerHTML = data.map(c => `
            <li class="comment-item">
                <b>${c.user_name}</b> 
                <small>${new Date(c.created_at).toLocaleDateString()}</small>
                <p>${c.comment_text}</p>
            </li>
        `).join('');
    }
}

async function sendComment() {
    const name = document.getElementById('userName').value.trim();
    const text = document.getElementById('userComment').value.trim();

    if (!name || !text) { alert("Талааларды толтуруңуз!"); return; }

    const { error } = await supabaseClient
        .from('site_comments')
        .insert([{ user_name: name, comment_text: text }]);

    if (!error) {
        document.getElementById('userComment').value = '';
        loadComments();
    }
}

// 7. КИРҮҮ ЖАНА ЧЫГУУ
async function handleLogin() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        document.getElementById('auth-msg').innerText = "Ката: " + error.message;
    } else {
        window.location.href = "profile.html";
    }
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = "auth.html";
}

// 8. ИШТЕТҮҮ
document.addEventListener('DOMContentLoaded', () => {
    checkAccess(); 
    loadComments();
    dynamicGreeting();
});