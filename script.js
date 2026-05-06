<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Олий Математика Тест Тизими</title>
    
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        :root {
            --primary: #2c3e50;
            --accent: #3498db;
            --success: #28a745;
            --danger: #dc3545;
            --bg: #f4f7f6;
        }

        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: var(--bg);
            margin: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        /* ЮҚОРИ ФОН (Меню) */
        header {
            background: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            z-index: 10;
        }

        #timer {
            font-size: 22px;
            font-weight: bold;
            color: var(--primary);
        }

        header nav a {
            text-decoration: none;
            color: var(--primary);
            margin-left: 15px;
            font-weight: 600;
        }

        /* АСОСИЙ ҚИСМ */
        main {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        #quiz-container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 550px;
            text-align: center;
        }

        h2 { font-size: 1.2rem; color: var(--primary); margin-bottom: 25px; }

        .options { display: grid; gap: 10px; }
        
        .option-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            text-align: center;
            transition: 0.2s;
        }

        .option-btn.selected {
            background: #495057;
            box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.5);
        }

        /* ПАСТКИ ПАНЕЛ (Статистика) */
        .bottom-panel {
            display: flex;
            gap: 10px;
            justify-content: center;
            align-items: center;
            margin-top: 30px;
        }

        .stat-circle {
            width: 35px;
            height: 24px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 0.85rem;
        }

        .stat-total { background: #adb5bd; }
        .stat-correct { background: var(--success); }
        .stat-wrong { background: var(--danger); }

        .control-btn {
            background: #adb5bd;
            color: white;
            border: none;
            padding: 8px 18px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
        }

        #submit-btn { opacity: 0.5; pointer-events: none; }
        #submit-btn.active { opacity: 1; background: var(--accent); pointer-events: auto; }

        /* ПАСТКИ ФОН (Footer) */
        footer {
            background: var(--primary);
            color: white;
            padding: 20px;
            text-align: center;
        }

        .ad-footer {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border: 1px dashed #777;
            margin-bottom: 15px;
            font-size: 0.8rem;
        }
    </style>
</head>
<body>

<header>
    <div id="timer">20:00</div>
    <nav>
        <a href="#">АСОСИЙ</a>
        <a href="#">НАТИЖАЛАР</a>
    </nav>
</header>

<main>
    <div id="quiz-container">
        <h2 id="question-text">Юкланмоқда...</h2>
        <div id="options-container" class="options"></div>

        <div class="bottom-panel">
            <div class="stat-circle stat-total" id="total-count">20</div>
            <div class="stat-circle stat-correct" id="correct-count">0</div>
            <div class="stat-circle stat-wrong" id="wrong-count">0</div>
            <button class="control-btn" onclick="skipQuestion()">Пропустить</button>
            <button class="control-btn" id="submit-btn" onclick="submitAnswer()">Ответить</button>
        </div>
    </div>
</main>

<footer>
    <div class="ad-footer">РЕКЛАМА УЧУН ЖОЙ (ПАСТКИ ФОН)</div>
    <p>&copy; 2026 Математика Тест Тизими</p>
</footer>

<script src="script.js"></script>
</body>
</html>