/**
 * Алгем — Данные для вкладки «Контрольная работа №1»
 * Включает задачи из вариантов № 2, 3, 4 и генератор вариантов
 */

const EXAM_DATA = {
  "meta": {
    "title": "Контрольная работа №1",
    "subtitle": "Степень матрицы Aⁿ, матричные уравнения, СЛАУ методом Гаусса, корни из комплексных чисел и базис векторов",
    "date": "Вторник, 3 ноября",
    "time": "Начало на первой паре • Продолжительность: 80–90 мин",
    "tasksCount": 5,
    "rules": [
      "Разрешены только чистые листы черновика и ручка (синяя или черная).",
      "Калькуляторы, конспекты, телефоны и любые электронные устройства строго запрещены.",
      "В чистовик записывается полное решение с обоснованием каждого шага, а не только ответ."
    ],
    "generalCriteria": [
      "Строгость математической логики: каждое преобразование СЛАУ или матричного уравнения должно быть обратимым либо явно обоснованным.",
      "Для степени матрицы Aⁿ: обязательно указать идею вычисления (разложение A = E + N с N² = 0, бином Ньютона или строгое доказательство по математической индукции).",
      "Для матричных уравнений AXB = C: обязательно проверить и явно записать det(A) ≠ 0 и det(B) ≠ 0 перед нахождением обратных матриц.",
      "Для корней из комплексных чисел: сначала полностью упростить дробь под корнем, выписать модуль |z| и аргумент φ, затем явно найти ВСЕ значения корня.",
      "Для базиса векторов: обязательно указать ранг системы, выписать выбранный базис и явно записать формулы выражения остальных векторов через базис."
    ]
  },
  "tasks": [
    {
      "id": "task-1-matrix-power",
      "num": 1,
      "code": "№ 1",
      "title": "Вычисление степени матрицы Aⁿ",
      "topic": "Матрицы и операции",
      "badge": "Матрицы • Степень матрицы",
      "synopsis": "<p>Задание проверяет умение находить формулу $n$-й степени квадратной матрицы $A^n$. В типовых контрольных работах матрицы подобраны так, что матрицу можно представить в виде суммы единичной и нильпотентной матриц: $A = \\lambda E + N$, где $N^2 = 0$. Так как $E$ и $N$ коммутируют ($EN = NE$), применима формула бинома Ньютона. Также полученную формулу можно строго доказать по методу математической индукции.</p>",
      "algorithm": "<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 1</div>\n  <div class=\"algo-step-content\">\n    <strong>Вычисляем $A^2$ и ищем закономерность:</strong>\n    <p>Перемножаем матрицу саму на себя: $A^2 = A \\cdot A$. Сравниваем $A^2$ с $A$ и $E$. Очень часто оказывается, что $A^2 = 2A - E$, то есть $A^2 - 2A + E = (A - E)^2 = 0$.</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 2</div>\n  <div class=\"algo-step-content\">\n    <strong>Метод нильпотентного разложения (быстрый способ):</strong>\n    <p>Представляем матрицу $A$ в виде суммы:</p>\n    $$A = E + N, \\quad \\text{где } N = A - E$$\n    <p>Проверяем квадрат матрицы $N$: возводим $N$ в квадрат. В задачах контрольной работы почти всегда $N^2 = 0$ (матрица $N$ нильпотентна второго порядка!).</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 3</div>\n  <div class=\"algo-step-content\">\n    <strong>Применяем бином Ньютона:</strong>\n    <p>Так как единичная матрица $E$ коммутирует с любой матрицей ($EN = NE = N$), то справедлива формула бинома:</p>\n    $$A^n = (E + N)^n = E^n + \\binom{n}{1} E^{n-1} N + \\binom{n}{2} E^{n-2} N^2 + \\dots + N^n$$\n    <p>Но поскольку $N^2 = 0$, то и все старшие степени $N^3 = 0, N^4 = 0, \\dots$ равны нулевой матрице! От всей суммы остаются только первые два слагаемых:</p>\n    $$A^n = E + nN = E + n(A - E)$$\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 4</div>\n  <div class=\"algo-step-content\">\n    <strong>Строгое доказательство по математической индукции (для чистовика):</strong>\n    <p>Для безупречного оформления на контрольной доказываем найденную формулу по индукции:</p>\n    <ul>\n      <li><strong>База индукции:</strong> при $n = 1$ формула $A^1 = E + 1 \\cdot N = E + N = A$ верна.</li>\n      <li><strong>Индукционный переход:</strong> пусть формула верна для $n = k$: $A^k = E + kN$. Докажем для $n = k + 1$:\n      $$A^{k+1} = A^k \\cdot A = (E + kN)(E + N) = E \\cdot E + E \\cdot N + kN \\cdot E + k N^2$$\n      Так как $N^2 = 0$, получаем: $E + N + kN + 0 = E + (k + 1)N$. Переход доказан!</li>\n    </ul>\n  </div>\n</div>",
      "formattingRules": [
        "Обязательно явно выпишите матрицу N = A - E и покажите вычисление N² = 0.",
        "Сошлитесь на коммутируемость EN = NE при использовании бинома Ньютона.",
        "В конце решения аккуратно выпишите итоговую матрицу размера 2×2, элементы которой зависят от n."
      ],
      "theoryLinks": [
        {
          "id": "mod-1-matrices",
          "title": "Модуль 1: Матрицы и операции над ними"
        },
        {
          "id": "ticket-1",
          "title": "Билет 1: Свойства умножения матриц"
        }
      ],
      "practiceLinks": [],
      "problems": [
        {
          "id": "prob-1-var2",
          "label": "Вариант № 2 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Вычислить $A^n$, где\n$$A = \\begin{pmatrix} -3 & -4 \\\\ 4 & 5 \\end{pmatrix}$$",
          "quickAnswer": "$$A^n = \\begin{pmatrix} 1 - 4n & -4n \\\\ 4n & 1 + 4n \\end{pmatrix}$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Разложение матрицы на единичную и нильпотентную</strong>\n  <p>Представим матрицу $A$ в виде $A = E + N$, где $E = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$.</p>\n  <p>Тогда:</p>\n  $$N = A - E = \\begin{pmatrix} -3 - 1 & -4 \\\\ 4 & 5 - 1 \\end{pmatrix} = \\begin{pmatrix} -4 & -4 \\\\ 4 & 4 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Проверка нильпотентности матрицы $N$</strong>\n  <p>Возведём матрицу $N$ в квадрат:</p>\n  $$N^2 = \\begin{pmatrix} -4 & -4 \\\\ 4 & 4 \\end{pmatrix} \\begin{pmatrix} -4 & -4 \\\\ 4 & 4 \\end{pmatrix} = \\begin{pmatrix} (-4)(-4) + (-4)(4) & (-4)(-4) + (-4)(4) \\\\ 4(-4) + 4(4) & 4(-4) + 4(4) \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = 0$$\n  <p>Матрица $N$ нильпотентна степени 2 ($N^2 = 0$). Значит, $N^k = 0$ при всех $k \\ge 2$.</p>\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Применение бинома Ньютона</strong>\n  <p>Так как $E$ и $N$ коммутируют ($EN = NE = N$), применяем формулу бинома Ньютона:</p>\n  $$A^n = (E + N)^n = E^n + n E^{n-1} N + \\frac{n(n-1)}{2} E^{n-2} N^2 + \\dots + N^n$$\n  <p>Поскольку $N^k = 0$ при $k \\ge 2$:</p>\n  $$A^n = E + nN = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} + n \\begin{pmatrix} -4 & -4 \\\\ 4 & 4 \\end{pmatrix} = \\begin{pmatrix} 1 - 4n & -4n \\\\ 4n & 1 + 4n \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 4: Доказательство по индукции (обоснование для проверяющего)</strong>\n  <ul>\n    <li>При $n = 1$: $\\begin{pmatrix} 1 - 4 & -4 \\\\ 4 & 1 + 4 \\end{pmatrix} = \\begin{pmatrix} -3 & -4 \\\\ 4 & 5 \\end{pmatrix} = A$ — верно.</li>\n    <li>Шаг индукции ($n \\to n+1$):\n    $$A^{n+1} = A^n \\cdot A = \\begin{pmatrix} 1 - 4n & -4n \\\\ 4n & 1 + 4n \\end{pmatrix} \\begin{pmatrix} -3 & -4 \\\\ 4 & 5 \\end{pmatrix}$$\n    Элемент $(1, 1)$: $(1 - 4n)(-3) + (-4n)(4) = -3 + 12n - 16n = 1 - 4(n + 1)$.<br>\n    Элемент $(1, 2)$: $(1 - 4n)(-4) + (-4n)(5) = -4 + 16n - 20n = -4(n + 1)$.<br>\n    Элемент $(2, 1)$: $(4n)(-3) + (1 + 4n)(4) = -12n + 4 + 16n = 4(n + 1)$.<br>\n    Элемент $(2, 2)$: $(4n)(-4) + (1 + 4n)(5) = -16n + 5 + 20n = 1 + 4(n + 1)$.</li>\n  </ul>\n  <p>Шаг индукции выполнен, формула верна для всех $n \\in \\mathbb{N}$.</p>\n</div>",
          "examinerNotes": "Преподаватель ставит высший балл, если решение содержит и разложение через нильпотентную матрицу N, и аккуратную проверку шага индукции."
        },
        {
          "id": "prob-1-var3",
          "label": "Вариант № 3 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Вычислить $A^n$, где\n$$A = \\begin{pmatrix} 4 & -3 \\\\ 3 & -2 \\end{pmatrix}$$",
          "quickAnswer": "$$A^n = \\begin{pmatrix} 1 + 3n & -3n \\\\ 3n & 1 - 3n \\end{pmatrix}$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Разложение $A = E + N$</strong>\n  $$N = A - E = \\begin{pmatrix} 4 - 1 & -3 \\\\ 3 & -2 - 1 \\end{pmatrix} = \\begin{pmatrix} 3 & -3 \\\\ 3 & -3 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Проверка квадрата матрицы $N$</strong>\n  $$N^2 = \\begin{pmatrix} 3 & -3 \\\\ 3 & -3 \\end{pmatrix} \\begin{pmatrix} 3 & -3 \\\\ 3 & -3 \\end{pmatrix} = \\begin{pmatrix} 9 - 9 & -9 + 9 \\\\ 9 - 9 & -9 + 9 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = 0$$\n  <p>Так как $N^2 = 0$, матрица $N$ нильпотентна степени 2.</p>\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Бином Ньютона</strong>\n  $$A^n = (E + N)^n = E + nN = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} + n \\begin{pmatrix} 3 & -3 \\\\ 3 & -3 \\end{pmatrix} = \\begin{pmatrix} 1 + 3n & -3n \\\\ 3n & 1 - 3n \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 4: Проверка для $n = 2$</strong>\n  $$A^2 = \\begin{pmatrix} 4 & -3 \\\\ 3 & -2 \\end{pmatrix} \\begin{pmatrix} 4 & -3 \\\\ 3 & -2 \\end{pmatrix} = \\begin{pmatrix} 16 - 9 & -12 + 6 \\\\ 12 - 6 & -9 + 4 \\end{pmatrix} = \\begin{pmatrix} 7 & -6 \\\\ 6 & -5 \\end{pmatrix}$$\n  <p>По общей формуле при $n = 2$: $\\begin{pmatrix} 1 + 3(2) & -3(2) \\\\ 3(2) & 1 - 3(2) \\end{pmatrix} = \\begin{pmatrix} 7 & -6 \\\\ 6 & -5 \\end{pmatrix}$. Совпало!</p>\n</div>",
          "examinerNotes": "Рекомендуется готовиться именно по этому типу задач: все вычисления целые и легко проверяются при n = 1 и n = 2."
        },
        {
          "id": "prob-1-var4",
          "label": "Вариант № 4 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Вычислить $A^n$, где\n$$A = \\begin{pmatrix} 3 & 2 \\\\ -2 & -1 \\end{pmatrix}$$",
          "quickAnswer": "$$A^n = \\begin{pmatrix} 1 + 2n & 2n \\\\ -2n & 1 - 2n \\end{pmatrix}$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Разложение $A = E + N$</strong>\n  $$N = A - E = \\begin{pmatrix} 3 - 1 & 2 \\\\ -2 & -1 - 1 \\end{pmatrix} = \\begin{pmatrix} 2 & 2 \\\\ -2 & -2 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Вычисление $N^2$</strong>\n  $$N^2 = \\begin{pmatrix} 2 & 2 \\\\ -2 & -2 \\end{pmatrix} \\begin{pmatrix} 2 & 2 \\\\ -2 & -2 \\end{pmatrix} = \\begin{pmatrix} 4 - 4 & 4 - 4 \\\\ -4 + 4 & -4 + 4 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = 0$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Формула $n$-й степени</strong>\n  $$A^n = E + nN = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} + n \\begin{pmatrix} 2 & 2 \\\\ -2 & -2 \\end{pmatrix} = \\begin{pmatrix} 1 + 2n & 2n \\\\ -2n & 1 - 2n \\end{pmatrix}$$\n</div>",
          "examinerNotes": "Обратите внимание на знаки при подстановке n = 1: элементы диагонали дают 1 + 2 = 3 и 1 - 2 = -1, вне диагонали 2 и -2."
        },
        {
          "id": "prob-1-basic",
          "label": "Базовый уровень: Жорданова клетка 2-го порядка",
          "difficulty": "basic",
          "condition": "Вычислить $A^n$, где\n$$A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$$",
          "quickAnswer": "$$A^n = \\begin{pmatrix} 1 & n \\\\ 0 & 1 \\end{pmatrix}$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Решение:</strong>\n  <p>Здесь $A = E + N$, где $N = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$.</p>\n  <p>$N^2 = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = 0$.</p>\n  <p>По биному Ньютона:</p>\n  $$A^n = E + nN = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} + \\begin{pmatrix} 0 & n \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & n \\\\ 0 & 1 \\end{pmatrix}$$\n</div>",
          "examinerNotes": "Классический пример элементарной жордановой клетки."
        },
        {
          "id": "prob-1-hard",
          "label": "Сложный уровень: Матрица 3×3 с N³ = 0",
          "difficulty": "hard",
          "condition": "Вычислить $A^n$, где\n$$A = \\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1 \\end{pmatrix}$$",
          "quickAnswer": "$$A^n = \\begin{pmatrix} 1 & n & \\frac{n(n-1)}{2} \\\\ 0 & 1 & n \\\\ 0 & 0 & 1 \\end{pmatrix}$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Разложение $A = E + N$</strong>\n  $$N = A - E = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Степени матрицы $N$</strong>\n  $$N^2 = \\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}, \\quad N^3 = 0$$\n  <p>Матрица $N$ нильпотентна степени 3.</p>\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Бином Ньютона с тремя слагаемыми</strong>\n  $$A^n = E + nN + \\frac{n(n-1)}{2} N^2 = \\begin{pmatrix} 1 & n & \\frac{n(n-1)}{2} \\\\ 0 & 1 & n \\\\ 0 & 0 & 1 \\end{pmatrix}$$\n</div>",
          "examinerNotes": "В матрицах 3×3 нильпотентность может быть 3-го порядка, тогда в формуле появляется слагаемое n(n-1)/2."
        }
      ]
    },
    {
      "id": "task-2-matrix-equations",
      "num": 2,
      "code": "№ 2",
      "title": "Матричные уравнения вида A · X · B = C",
      "topic": "Матрицы и элементарные преобразования",
      "badge": "Матрицы • Матричные уравнения",
      "synopsis": "<p>Задание проверяет умение решать двусторонние матричные уравнения $A \\cdot X \\cdot B = C$. Чтобы изолировать неизвестную матрицу $X$, уравнение умножается слева на $A^{-1}$ и справа на $B^{-1}$: $X = A^{-1} C B^{-1}$. Задача требует нахождения обратной матрицы порядка 2 (через определитель и присоединенную матрицу) и обратной матрицы порядка 3 (методом Гаусса–Жордана $(B \\mid E) \\sim (E \\mid B^{-1})$).</p>",
      "algorithm": "<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 1</div>\n  <div class=\"algo-step-content\">\n    <strong>Анализ размеров и алгебраическое решение:</strong>\n    <p>Пусть $A$ размера $2 \\times 2$, $B$ размера $3 \\times 3$, $C$ размера $2 \\times 3$. Тогда $X$ имеет размер $2 \\times 3$.</p>\n    <p>Умножаем уравнение $A X B = C$ слева на $A^{-1}$ и справа на $B^{-1}$:</p>\n    $$A^{-1}(A X B)B^{-1} = A^{-1} C B^{-1} \\implies X = A^{-1} C B^{-1}$$\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 2</div>\n  <div class=\"algo-step-content\">\n    <strong>Нахождение обратной матрицы $A^{-1}$ ($2 \\times 2$):</strong>\n    <p>Считаем $\\det A = ad - bc$. Если $\\det A \\neq 0$, обратная вычисляется по готовой формуле:</p>\n    $$A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 3</div>\n  <div class=\"algo-step-content\">\n    <strong>Нахождение обратной матрицы $B^{-1}$ ($3 \\times 3$):</strong>\n    <p>Применяем метод Гаусса–Жордана: приписываем справа единичную матрицу $(B \\mid E)$ и элементарными преобразованиями строк приводим левую половину к единичной: $(B \\mid E) \\sim (E \\mid B^{-1})$.</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 4</div>\n  <div class=\"algo-step-content\">\n    <strong>Последовательное умножение:</strong>\n    <p>Сначала умножаем $Y = A^{-1} \\cdot C$ (матрица $2 \\times 3$). Затем вычисляем $X = Y \\cdot B^{-1}$ (матрица $2 \\times 3$).</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 5</div>\n  <div class=\"algo-step-content\">\n    <strong>Проверка:</strong>\n    <p>Подставляем найденную матрицу $X$ в левую часть $A X B$ и убеждаемся, что в точности получается $C$.</p>\n  </div>\n</div>",
      "formattingRules": [
        "Обязательно выпишите det(A) и det(B) и укажите, что они не равны нулю, поэтому обратные существуют.",
        "Не путайте порядок: умножение на A⁻¹ идет строго СЛЕВА, а на B⁻¹ — строго СПРАВА!",
        "При нахождении B⁻¹ методом Гаусса–Жордана аккуратно фиксируйте каждое преобразование строк (например, S₂ → S₂ + 3S₁)."
      ],
      "theoryLinks": [
        {
          "id": "mod-2-elementary-inverse",
          "title": "Модуль 2: Обратные матрицы и элементарные преобразования"
        },
        {
          "id": "ticket-3",
          "title": "Билет 3: Критерий обратимости матриц"
        }
      ],
      "practiceLinks": [],
      "problems": [
        {
          "id": "prob-2-var2",
          "label": "Вариант № 2 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Решить матричное уравнение:\n$$\\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix} \\cdot X \\cdot \\begin{pmatrix} 4 & 1 & 3 \\\\ -3 & -1 & -1 \\\\ 3 & 1 & 2 \\end{pmatrix} = \\begin{pmatrix} -2 & -1 & -2 \\\\ 2 & 1 & 3 \\end{pmatrix}$$",
          "quickAnswer": "$$X = \\begin{pmatrix} 1 & 0 & -2 \\\\ 0 & 1 & 1 \\end{pmatrix}$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Формула решения</strong>\n  <p>Пусть $A = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$, $B = \\begin{pmatrix} 4 & 1 & 3 \\\\ -3 & -1 & -1 \\\\ 3 & 1 & 2 \\end{pmatrix}$, $C = \\begin{pmatrix} -2 & -1 & -2 \\\\ 2 & 1 & 3 \\end{pmatrix}$.</p>\n  <p>Решение уравнения $A X B = C$: $X = A^{-1} C B^{-1}$.</p>\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Нахождение $A^{-1}$</strong>\n  $$\\det A = 1 \\cdot 2 - (-1)(-1) = 2 - 1 = 1 \\neq 0$$\n  $$A^{-1} = \\frac{1}{1} \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Нахождение $B^{-1}$ методом Гаусса–Жордана</strong>\n  <p>Составляем расширенную матрицу $(B \\mid E)$:</p>\n  $$\\begin{pmatrix} 4 & 1 & 3 & \\mid & 1 & 0 & 0 \\\\ -3 & -1 & -1 & \\mid & 0 & 1 & 0 \\\\ 3 & 1 & 2 & \\mid & 0 & 0 & 1 \\end{pmatrix}$$\n  <p>1. Вычтем третью строку из первой: $S_1 \\to S_1 - S_3$:</p>\n  $$\\begin{pmatrix} 1 & 0 & 1 & \\mid & 1 & 0 & -1 \\\\ -3 & -1 & -1 & \\mid & 0 & 1 & 0 \\\\ 3 & 1 & 2 & \\mid & 0 & 0 & 1 \\end{pmatrix}$$\n  <p>2. Прибавим к $S_2$ три $S_1$, из $S_3$ вычтем три $S_1$ ($S_2 \\to S_2 + 3S_1$, $S_3 \\to S_3 - 3S_1$):</p>\n  $$\\begin{pmatrix} 1 & 0 & 1 & \\mid & 1 & 0 & -1 \\\\ 0 & -1 & 2 & \\mid & 3 & 1 & -3 \\\\ 0 & 1 & -1 & \\mid & -3 & 0 & 4 \\end{pmatrix}$$\n  <p>3. Прибавим $S_3$ к $S_2$: $S_2 \\to S_2 + S_3$, затем умножим $S_2$ на $-1$:</p>\n  <p>Последовательно приводя к единичной матрице слева, получаем:</p>\n  $$B^{-1} = \\begin{pmatrix} 1 & -1 & -2 \\\\ -3 & 1 & 5 \\\\ 0 & 1 & 1 \\end{pmatrix}$$\n  <p><em>Проверка $B \\cdot B^{-1}$:</em> $\\begin{pmatrix} 4 & 1 & 3 \\\\ -3 & -1 & -1 \\\\ 3 & 1 & 2 \\end{pmatrix} \\begin{pmatrix} 1 & -1 & -2 \\\\ -3 & 1 & 5 \\\\ 0 & 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} = E_3$.</p>\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 4: Вычисление произведения $Y = A^{-1} C$</strong>\n  $$Y = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} -2 & -1 & -2 \\\\ 2 & 1 & 3 \\end{pmatrix} = \\begin{pmatrix} 2(-2) + 1(2) & 2(-1) + 1(1) & 2(-2) + 1(3) \\\\ 1(-2) + 1(2) & 1(-1) + 1(1) & 1(-2) + 1(3) \\end{pmatrix} = \\begin{pmatrix} -2 & -1 & -1 \\\\ 0 & 0 & 1 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 5: Вычисление $X = Y B^{-1}$</strong>\n  $$X = \\begin{pmatrix} -2 & -1 & -1 \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} 1 & -1 & -2 \\\\ -3 & 1 & 5 \\\\ 0 & 1 & 1 \\end{pmatrix}$$\n  <p>Строка 1:</p>\n  <ul>\n    <li>$x_{11} = (-2)(1) + (-1)(-3) + (-1)(0) = -2 + 3 + 0 = 1$</li>\n    <li>$x_{12} = (-2)(-1) + (-1)(1) + (-1)(1) = 2 - 1 - 1 = 0$</li>\n    <li>$x_{13} = (-2)(-2) + (-1)(5) + (-1)(1) = 4 - 5 - 1 = -2$</li>\n  </ul>\n  <p>Строка 2:</p>\n  <ul>\n    <li>$x_{21} = 0(1) + 0(-3) + 1(0) = 0$</li>\n    <li>$x_{22} = 0(-1) + 0(1) + 1(1) = 1$</li>\n    <li>$x_{23} = 0(-2) + 0(5) + 1(1) = 1$</li>\n  </ul>\n  $$X = \\begin{pmatrix} 1 & 0 & -2 \\\\ 0 & 1 & 1 \\end{pmatrix}$$\n</div>",
          "examinerNotes": "Рекомендуемый вариант для подготовки! Ответ получается красивым и целочисленным."
        },
        {
          "id": "prob-2-var3",
          "label": "Вариант № 3 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Решить матричное уравнение:\n$$\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} \\cdot X \\cdot \\begin{pmatrix} 2 & 5 & 5 \\\\ 1 & 3 & 2 \\\\ 1 & 2 & 2 \\end{pmatrix} = \\begin{pmatrix} -2 & -1 & -2 \\\\ -3 & -4 & -5 \\end{pmatrix}$$",
          "quickAnswer": "$$X = \\begin{pmatrix} 1 & 0 & -1 \\\\ 0 & 1 & -5 \\end{pmatrix}$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Нахождение $A^{-1}$</strong>\n  $$\\det A = 2(1) - 1(1) = 1 \\neq 0 \\implies A^{-1} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Нахождение $B^{-1}$</strong>\n  <p>Применяя метод Гаусса–Жордана к $(B \\mid E_3)$, получаем:</p>\n  $$B^{-1} = \\begin{pmatrix} -2 & 0 & 5 \\\\ 0 & 1 & -1 \\\\ 1 & -1 & -1 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Вычисление $Y = A^{-1} C$</strong>\n  $$Y = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix} \\begin{pmatrix} -2 & -1 & -2 \\\\ -3 & -4 & -5 \\end{pmatrix} = \\begin{pmatrix} 1 & 3 & 3 \\\\ -4 & -7 & -8 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 4: Вычисление $X = Y B^{-1}$</strong>\n  $$X = \\begin{pmatrix} 1 & 3 & 3 \\\\ -4 & -7 & -8 \\end{pmatrix} \\begin{pmatrix} -2 & 0 & 5 \\\\ 0 & 1 & -1 \\\\ 1 & -1 & -1 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 & -1 \\\\ 0 & 1 & -5 \\end{pmatrix}$$\n</div>",
          "examinerNotes": "Все элементы матрицы X целые: [1, 0, -1] и [0, 1, -5]."
        },
        {
          "id": "prob-2-var4",
          "label": "Вариант № 4 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Решить матричное уравнение:\n$$\\begin{pmatrix} -1 & 3 \\\\ -1 & 2 \\end{pmatrix} \\cdot X \\cdot \\begin{pmatrix} 2 & -3 & 2 \\\\ -2 & 4 & -3 \\\\ -1 & 2 & -2 \\end{pmatrix} = \\begin{pmatrix} -3 & 5 & -1 \\\\ -3 & 5 & -2 \\end{pmatrix}$$",
          "quickAnswer": "$$X = \\begin{pmatrix} 1 & 0 & -1 \\\\ 0 & 1 & -2 \\end{pmatrix}$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Нахождение $A^{-1}$</strong>\n  $$\\det A = (-1)(2) - 3(-1) = -2 + 3 = 1 \\neq 0 \\implies A^{-1} = \\begin{pmatrix} 2 & -3 \\\\ 1 & -1 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Нахождение $B^{-1}$</strong>\n  $$B^{-1} = \\begin{pmatrix} 2 & 2 & -1 \\\\ 1 & 2 & -2 \\\\ 0 & 1 & -2 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Вычисление $Y = A^{-1} C$</strong>\n  $$Y = \\begin{pmatrix} 2 & -3 \\\\ 1 & -1 \\end{pmatrix} \\begin{pmatrix} -3 & 5 & -1 \\\\ -3 & 5 & -2 \\end{pmatrix} = \\begin{pmatrix} 3 & -5 & 4 \\\\ 0 & 0 & 1 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 4: Вычисление $X = Y B^{-1}$</strong>\n  $$X = \\begin{pmatrix} 3 & -5 & 4 \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} 2 & 2 & -1 \\\\ 1 & 2 & -2 \\\\ 0 & 1 & -2 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 & -1 \\\\ 0 & 1 & -2 \\end{pmatrix}$$\n</div>",
          "examinerNotes": "Решение также дает красивую матрицу X."
        },
        {
          "id": "prob-2-basic",
          "label": "Базовый уровень: Одностороннее уравнение AX = C",
          "difficulty": "basic",
          "condition": "Решить уравнение $\\begin{pmatrix} 2 & 3 \\\\ 1 & 2 \\end{pmatrix} X = \\begin{pmatrix} 7 & 4 \\\\ 4 & 2 \\end{pmatrix}$.",
          "quickAnswer": "$$X = \\begin{pmatrix} 2 & 2 \\\\ 1 & 0 \\end{pmatrix}$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <p>$\\det A = 4 - 3 = 1 \\implies A^{-1} = \\begin{pmatrix} 2 & -3 \\\\ -1 & 2 \\end{pmatrix}$.</p>\n  <p>$X = A^{-1} C = \\begin{pmatrix} 2 & -3 \\\\ -1 & 2 \\end{pmatrix} \\begin{pmatrix} 7 & 4 \\\\ 4 & 2 \\end{pmatrix} = \\begin{pmatrix} 2 & 2 \\\\ 1 & 0 \\end{pmatrix}$.</p>\n</div>",
          "examinerNotes": "Базовая разминка перед двусторонним уравнением."
        },
        {
          "id": "prob-2-hard",
          "label": "Сложный уровень: Уравнение с вырожденной матрицей",
          "difficulty": "hard",
          "condition": "Решить уравнение $\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix} X = \\begin{pmatrix} 3 & 5 \\\\ 6 & 10 \\end{pmatrix}$.",
          "quickAnswer": "Бесконечно много решений: $X = \\begin{pmatrix} 3 - 2c_1 & 5 - 2c_2 \\\\ c_1 & c_2 \\end{pmatrix}$, $c_1, c_2 \\in \\mathbb{R}$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <p>Так как $\\det A = 0$, матрица $A$ вырождена и $A^{-1}$ не существует! Однако строки правой части пропорциональны строкам левой: $S_2 = 2S_1$. Система совместна и сводится к уравнению $x_{1j} + 2x_{2j} = c_{1j}$.</p>\n</div>",
          "examinerNotes": "Тонкий момент: отсутствие обратной матрицы не означает отсутствия решений!"
        }
      ]
    },
    {
      "id": "task-3-slau-gauss",
      "num": 3,
      "code": "№ 3",
      "title": "СЛАУ: метод Гаусса, ранги, общее и частное решения",
      "topic": "Системы линейных уравнений",
      "badge": "СЛАУ • Метод Гаусса",
      "synopsis": "<p>Задание требует применить метод Гаусса к прямоугольной системе линейных уравнений, определить ранг основной матрицы $\\operatorname{rk} A$ и ранг расширенной матрицы $\\operatorname{rk}(A \\mid b)$, применить теорему Кронекера–Капелли и при наличии решений найти общее решение (разделив неизвестные на главные и свободные) и указать одно частное решение.</p>",
      "algorithm": "<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 1</div>\n  <div class=\"algo-step-content\">\n    <strong>Выписываем расширенную матрицу $(A \\mid b)$:</strong>\n    <p>Коэффициенты при неизвестных образуют основную матрицу $A$, правая часть — столбец свободных членов $b$.</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 2</div>\n  <div class=\"algo-step-content\">\n    <strong>Прямой ход метода Гаусса:</strong>\n    <p>Элементарными преобразованиями строк обнуляем элементы под главной диагональю, приводя матрицу к ступенчатому виду.</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 3</div>\n  <div class=\"algo-step-content\">\n    <strong>Вычисление рангов и теорема Кронекера–Капелли:</strong>\n    <ul>\n      <li>$\\operatorname{rk} A$ равен числу ненулевых строк в основной матрице.</li>\n      <li>$\\operatorname{rk}(A \\mid b)$ равен числу ненулевых строк в расширенной матрице.</li>\n      <li><strong>Случай 1:</strong> если появилась строка $(0 \\; 0 \\; \\dots \\; 0 \\mid d)$, где $d \\neq 0$, то $\\operatorname{rk} A < \\operatorname{rk}(A \\mid b)$, и по теореме Кронекера–Капелли система <strong>несовместна (решений нет)</strong>.</li>\n      <li><strong>Случай 2:</strong> если $\\operatorname{rk} A = \\operatorname{rk}(A \\mid b) = r$, система <strong>совместна</strong>.</li>\n    </ul>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 4</div>\n  <div class=\"algo-step-content\">\n    <strong>Разделение на главные и свободные неизвестные:</strong>\n    <p>Если $r < n$ (число неизвестных), то неизвестные, стоящие на ступеньках, называются <em>главными</em> (базисными), а оставшиеся $n - r$ неизвестных — <em>свободными</em>. Обозначаем свободные неизвестные параметрами $c_1, \\dots, c_{n-r} \\in \\mathbb{R}$.</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 5</div>\n  <div class=\"algo-step-content\">\n    <strong>Общее и частное решение:</strong>\n    <p>Обратным ходом выражаем главные неизвестные через свободные — получаем <strong>общее решение</strong>. Подставляя конкретные числовые значения параметров (например, $c_i = 0$), получаем <strong>частное решение</strong>.</p>\n  </div>\n</div>",
      "formattingRules": [
        "Обязательно явно напишите значения: rk(A) = ... и rk(A|b) = ...",
        "Сошлитесь на теорему Кронекера–Капелли при обосновании совместности или несовместности.",
        "Если решений бесконечно много, четко перечислите: «Главные неизвестные: ..., свободные: ...»."
      ],
      "theoryLinks": [
        {
          "id": "mod-3-systems-gauss",
          "title": "Модуль 3: СЛАУ и метод Гаусса"
        },
        {
          "id": "ticket-16",
          "title": "Билет 16: Теорема Кронекера–Капелли"
        },
        {
          "id": "ticket-19",
          "title": "Билет 19: Структура решений неоднородной СЛАУ"
        }
      ],
      "practiceLinks": [],
      "problems": [
        {
          "id": "prob-3-var2",
          "label": "Вариант № 2 (из реальной КР — Несовместная система)",
          "difficulty": "medium",
          "condition": "Найти общее и одно частное решение системы линейных уравнений методом Гаусса. Чему равны ранги основной и расширенной матриц?\n$$\\begin{cases} 6x_1 + 7x_2 + x_3 + 4x_4 = 3 \\\\ -4x_1 - 3x_2 + x_3 - x_4 = 3 \\\\ 4x_1 + 5x_2 + x_3 + 3x_4 = 1 \\end{cases}$$",
          "quickAnswer": "$$\\operatorname{rk} A = 2, \\quad \\operatorname{rk}(A \\mid b) = 3$$\nПо теореме Кронекера–Капелли система несовместна (решений нет).",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Составляем расширенную матрицу $(A \\mid b)$</strong>\n  $$\\begin{pmatrix} 6 & 7 & 1 & 4 & \\mid & 3 \\\\ -4 & -3 & 1 & -1 & \\mid & 3 \\\\ 4 & 5 & 1 & 3 & \\mid & 1 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Элементарные преобразования строк</strong>\n  <p>1. Вычтем третью строку из первой ($S_1 \\to S_1 - S_3$):</p>\n  $$\\begin{pmatrix} 2 & 2 & 0 & 1 & \\mid & 2 \\\\ -4 & -3 & 1 & -1 & \\mid & 3 \\\\ 4 & 5 & 1 & 3 & \\mid & 1 \\end{pmatrix}$$\n  <p>2. Прибавим к $S_2$ удвоенную первую ($S_2 \\to S_2 + 2S_1$), и вычтем из $S_3$ удвоенную первую ($S_3 \\to S_3 - 2S_1$):</p>\n  $$\\begin{pmatrix} 2 & 2 & 0 & 1 & \\mid & 2 \\\\ 0 & 1 & 1 & 1 & \\mid & 7 \\\\ 0 & 1 & 1 & 1 & \\mid & -3 \\end{pmatrix}$$\n  <p>3. Вычтем вторую строку из третьей ($S_3 \\to S_3 - S_2$):</p>\n  $$\\begin{pmatrix} 2 & 2 & 0 & 1 & \\mid & 2 \\\\ 0 & 1 & 1 & 1 & \\mid & 7 \\\\ 0 & 0 & 0 & 0 & \\mid & -10 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Вычисление рангов и формулировка вывода</strong>\n  <p>В основной матрице $A$ третья строка нулевая, число ненулевых строк равно 2:</p>\n  $$\\operatorname{rk} A = 2$$\n  <p>В расширенной матрице $(A \\mid b)$ третья строка содержит ненулевой свободный член $-10$ (уравнение вида $0 \\cdot x_1 + 0 \\cdot x_2 + 0 \\cdot x_3 + 0 \\cdot x_4 = -10$), число ненулевых строк равно 3:</p>\n  $$\\operatorname{rk}(A \\mid b) = 3$$\n  <p>Так как $\\operatorname{rk} A \\neq \\operatorname{rk}(A \\mid b)$, по теореме Кронекера–Капелли система <strong>несовместна</strong> (не имеет решений). Соответственно, общего и частных решений не существует.</p>\n</div>",
          "examinerNotes": "Классическая задача с нюансом: условие просит 'найти общее и частное решение', провоцируя студента искать их, но система оказывается несовместной! Ответ: rk(A) = 2, rk(A|b) = 3, решений нет."
        },
        {
          "id": "prob-3-var3",
          "label": "Вариант № 3 (из реальной КР — Совместная неопределенная система)",
          "difficulty": "medium",
          "condition": "Найти общее и одно частное решение СЛАУ методом Гаусса. Чему равны ранги основной и расширенной матриц?\n$$\\begin{cases} 3x_1 - x_2 - x_3 + x_4 = -6 \\\\ 5x_1 - 6x_2 - x_3 + 4x_4 = -5 \\\\ -4x_1 + 3x_2 + x_3 - 2x_4 = 5 \\end{cases}$$",
          "quickAnswer": "$$\\operatorname{rk} A = \\operatorname{rk}(A \\mid b) = 3$$\nОбщее решение: $x_1 = 3 + c, \\; x_2 = 1 + c, \\; x_3 = 14 + 3c, \\; x_4 = c \\; (c \\in \\mathbb{R})$.\nЧастное решение: $(3, 1, 14, 0)^T$.",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Расширенная матрица $(A \\mid b)$</strong>\n  $$\\begin{pmatrix} 3 & -1 & -1 & 1 & \\mid & -6 \\\\ 5 & -6 & -1 & 4 & \\mid & -5 \\\\ -4 & 3 & 1 & -2 & \\mid & 5 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Приведение к ступенчатому виду</strong>\n  <p>Прибавим первую строку к третьей ($S_3 \\to S_3 + S_1$):</p>\n  $$\\begin{pmatrix} 3 & -1 & -1 & 1 & \\mid & -6 \\\\ 5 & -6 & -1 & 4 & \\mid & -5 \\\\ -1 & 2 & 0 & -1 & \\mid & -1 \\end{pmatrix}$$\n  <p>Последовательными преобразованиями Гаусса матрица приводится к виду:</p>\n  $$\\begin{pmatrix} 1 & 0 & 0 & -1 & \\mid & 3 \\\\ 0 & 1 & 0 & -1 & \\mid & 1 \\\\ 0 & 0 & 1 & -3 & \\mid & 14 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Ранги</strong>\n  $$\\operatorname{rk} A = 3, \\quad \\operatorname{rk}(A \\mid b) = 3$$\n  <p>Так как ранги равны ($r = 3$) и меньше числа переменных ($n = 4$), система совместна и имеет бесконечно много решений.</p>\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 4: Главные и свободные неизвестные, общее решение</strong>\n  <ul>\n    <li>Главные неизвестные: $x_1, x_2, x_3$.</li>\n    <li>Свободная неизвестная: $x_4 = c \\in \\mathbb{R}$.</li>\n  </ul>\n  $$\\begin{cases} x_1 = 3 + c \\\\ x_2 = 1 + c \\\\ x_3 = 14 + 3c \\\\ x_4 = c \\end{cases}$$\n  <p>В векторной форме:</p>\n  $$X = \\begin{pmatrix} 3 \\\\ 1 \\\\ 14 \\\\ 0 \\end{pmatrix} + c \\begin{pmatrix} 1 \\\\ 1 \\\\ 3 \\\\ 1 \\end{pmatrix}, \\quad c \\in \\mathbb{R}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 5: Частное решение</strong>\n  <p>Полагая $c = 0$, получаем одно частное решение:</p>\n  $$X_{\\text{част}} = (3, 1, 14, 0)^T$$\n</div>",
          "examinerNotes": "Рекомендуемый вариант для тренировки: идеально иллюстрирует разделение на общее решение однородной системы и частное решение неоднородной."
        },
        {
          "id": "prob-3-var4",
          "label": "Вариант № 4 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Найти общее и одно частное решение СЛАУ методом Гаусса. Чему равны ранги:\n$$\\begin{cases} 4x_1 - 2x_2 + 3x_3 - 4x_4 = 3 \\\\ 3x_1 + 2x_2 - 2x_3 + 5x_4 = -1 \\\\ -7x_1 + x_2 - 2x_3 + x_4 = -3 \\end{cases}$$",
          "quickAnswer": "$$\\operatorname{rk} A = \\operatorname{rk}(A \\mid b) = 3$$\nОбщее решение: $x_1 = \\frac{1-c}{3}, \\; x_2 = \\frac{-4-2c}{3}, \\; x_3 = \\frac{-1+4c}{3}, \\; x_4 = c$.\nЧастное решение (при $c=1$): $(0, -2, 1, 1)^T$.",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <p>Применяя метод Гаусса к расширенной матрице, получаем ранг $\\operatorname{rk} A = \\operatorname{rk}(A \\mid b) = 3$.</p>\n  <p>Свободная переменная $x_4 = c$. Главные переменные выражаются как:</p>\n  $$x_1 = \\frac{1}{3} - \\frac{1}{3}c, \\quad x_2 = -\\frac{4}{3} - \\frac{2}{3}c, \\quad x_3 = -\\frac{1}{3} + \\frac{4}{3}c$$\n  <p>Подставляя удобное значение $c = 1$, избавляемся от дробей и получаем красивое частное решение:</p>\n  $$X_{\\text{част}} = (0, -2, 1, 1)^T$$\n</div>",
          "examinerNotes": "Подсказка: выбор параметра c = 1 дает целые координаты частного решения."
        },
        {
          "id": "prob-3-basic",
          "label": "Базовый уровень: Система с единственным решением",
          "difficulty": "basic",
          "condition": "Решить СЛАУ методом Гаусса:\n$$\\begin{cases} x_1 + x_2 + x_3 = 6 \\\\ 2x_1 - x_2 + x_3 = 3 \\\\ 3x_1 + x_2 - x_3 = 2 \\end{cases}$$",
          "quickAnswer": "$$\\operatorname{rk} A = \\operatorname{rk}(A \\mid b) = 3 = n, \\quad X = (1, 2, 3)^T$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <p>Прямой ход Гаусса дает единственное решение: $x_1 = 1, x_2 = 2, x_3 = 3$. Ранг равен числу неизвестных, система определена.</p>\n</div>",
          "examinerNotes": "Базовая задача на аккуратность прямого и обратного хода Гаусса."
        },
        {
          "id": "prob-3-hard",
          "label": "Сложный уровень: СЛАУ с параметром λ",
          "difficulty": "hard",
          "condition": "Исследовать систему в зависимости от параметра $\\lambda$:\n$$\\begin{cases} \\lambda x_1 + x_2 + x_3 = 1 \\\\ x_1 + \\lambda x_2 + x_3 = 1 \\\\ x_1 + x_2 + \\lambda x_3 = 1 \\end{cases}$$",
          "quickAnswer": "При $\\lambda = -2$: решений нет. При $\\lambda = 1$: $\\infty$ решений ($x_1 + x_2 + x_3 = 1$). При $\\lambda \\neq 1, -2$: единственное решение $x_1 = x_2 = x_3 = \\frac{1}{\\lambda + 2}$.",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <p>Складываем все три строки: $(\\lambda + 2)(x_1 + x_2 + x_3) = 3$.</p>\n  <p>Критические значения параметра: $\\lambda = -2$ (деление на ноль, несовместность) и $\\lambda = 1$ (ранг равен 1, плоскость решений).</p>\n</div>",
          "examinerNotes": "Классическая экзаменационная задача повышенной сложности."
        }
      ]
    },
    {
      "id": "task-4-complex-roots",
      "num": 4,
      "code": "№ 4",
      "title": "Комплексные числа: деление и корни ⁴√w по формуле Муавра",
      "topic": "Комплексные числа",
      "badge": "Комплексные числа • Формула Муавра",
      "synopsis": "<p>Задание проверяет владение алгебраической и тригонометрической формами комплексных чисел. Требуется сначала упростить комплексную дробь под корнем путем умножения числителя и знаменателя на сопряженное знаменателя, затем перевести полученное число в тригонометрическую форму $r(\\cos \\varphi + i\\sin \\varphi)$ и извлечь корни 4-й степени по формуле Муавра, выписав все 4 значения корня.</p>",
      "algorithm": "<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 1</div>\n  <div class=\"algo-step-content\">\n    <strong>Упрощение дроби под корнем (избавление от мнимости в знаменателе):</strong>\n    <p>Пусть под корнем стоит выражение $\\dfrac{u}{v}$. Умножаем числитель и знаменатель на комплексно сопряженное $\\bar{v}$:</p>\n    $$z = \\frac{u}{v} = \\frac{u \\cdot \\bar{v}}{|v|^2}$$\n    <p>Раскрываем скобки в числителе, учитывая $i^2 = -1$, и делим действительную и мнимую части на вещественный знаменатель $|v|^2$. Получаем число в алгебраической форме $z = a + bi$.</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 2</div>\n  <div class=\"algo-step-content\">\n    <strong>Нахождение модуля $r$ и аргумента $\\varphi$:</strong>\n    $$r = |z| = \\sqrt{a^2 + b^2}$$\n    <p>Аргумент $\\varphi$ определяется из системы:</p>\n    $$\\cos \\varphi = \\frac{a}{r}, \\quad \\sin \\varphi = \\frac{b}{r}$$\n    <p>Внимательно определяем четверть плоскости по знакам $a$ и $b$!</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 3</div>\n  <div class=\"algo-step-content\">\n    <strong>Формула Муавра для корней $n$-й степени:</strong>\n    $$w_k = \\sqrt[n]{r} \\left( \\cos \\frac{\\varphi + 2\\pi k}{n} + i \\sin \\frac{\\varphi + 2\\pi k}{n} \\right), \\quad k = 0, 1, \\dots, n - 1$$\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 4</div>\n  <div class=\"algo-step-content\">\n    <strong>Явный расчет всех значений:</strong>\n    <p>Для корня 4-й степени перебираем $k = 0, 1, 2, 3$. Находим углы, вычисляем точные табличные значения косинуса и синуса и записываем каждый корень в виде $x_k + i y_k$.</p>\n  </div>\n</div>",
      "formattingRules": [
        "Всегда явно покажите умножение на сопряженное знаменателя.",
        "Выпишите модуль r и главное значение аргумента φ до перехода к корням.",
        "Все n значений корней (для n = 4 это w₀, w₁, w₂, w₃) должны быть записаны явно."
      ],
      "theoryLinks": [
        {
          "id": "mod-4-complex-numbers",
          "title": "Модуль 4: Комплексные числа"
        },
        {
          "id": "mod-5-roots-moivre",
          "title": "Модуль 5: Формула Муавра и корни n-й степени"
        },
        {
          "id": "ticket-8",
          "title": "Билет 8: Тригонометрическая форма и формула Муавра"
        }
      ],
      "practiceLinks": [],
      "problems": [
        {
          "id": "prob-4-var2",
          "label": "Вариант № 2 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Вычислить:\n$$\\sqrt[4]{\\frac{-8 - 8\\sqrt{3} + (8 - 8\\sqrt{3})i}{1 - i}}$$",
          "quickAnswer": "$$w_0 = 1 + \\sqrt{3}i, \\quad w_1 = -\\sqrt{3} + i, \\quad w_2 = -1 - \\sqrt{3}i, \\quad w_3 = \\sqrt{3} - i$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Избавление от знаменателя</strong>\n  <p>Умножим числитель и знаменатель на сопряженное знаменателя $1 + i$:</p>\n  $$z = \\frac{[-8 - 8\\sqrt{3} + (8 - 8\\sqrt{3})i](1 + i)}{(1 - i)(1 + i)} = \\frac{[-8 - 8\\sqrt{3} + (8 - 8\\sqrt{3})i](1 + i)}{1 - i^2} = \\frac{\\dots}{2}$$\n  <p>Раскрываем скобки в числителе:</p>\n  $$\\operatorname{Re} = (-8 - 8\\sqrt{3}) - (8 - 8\\sqrt{3}) = -8 - 8\\sqrt{3} - 8 + 8\\sqrt{3} = -16$$\n  $$\\operatorname{Im} = (-8 - 8\\sqrt{3}) + (8 - 8\\sqrt{3}) = -8 - 8\\sqrt{3} + 8 - 8\\sqrt{3} = -16\\sqrt{3}$$\n  <p>Делим на 2:</p>\n  $$z = \\frac{-16 - 16\\sqrt{3}i}{2} = -8 - 8\\sqrt{3}i$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Тригонометрическая форма числа $z = -8 - 8\\sqrt{3}i$</strong>\n  <p>1. Модуль:</p>\n  $$r = \\sqrt{(-8)^2 + (-8\\sqrt{3})^2} = \\sqrt{64 + 64 \\cdot 3} = \\sqrt{64 \\cdot 4} = \\sqrt{256} = 16$$\n  <p>2. Аргумент:</p>\n  $$\\cos \\varphi = \\frac{-8}{16} = -\\frac{1}{2}, \\quad \\sin \\varphi = \\frac{-8\\sqrt{3}}{16} = -\\frac{\\sqrt{3}}{2}$$\n  <p>Оба знака отрицательны, точка лежит в III четверти комплексной плоскости:</p>\n  $$\\varphi = -\\frac{2\\pi}{3} \\quad \\left(\\text{или } \\frac{4\\pi}{3}\\right)$$\n  $$z = 16 \\left( \\cos \\frac{4\\pi}{3} + i \\sin \\frac{4\\pi}{3} \\right)$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Извлечение корня 4-й степени</strong>\n  $$\\sqrt[4]{r} = \\sqrt[4]{16} = 2$$\n  <p>По формуле Муавра для корней:</p>\n  $$w_k = 2 \\left( \\cos \\frac{\\frac{4\\pi}{3} + 2\\pi k}{4} + i \\sin \\frac{\\frac{4\\pi}{3} + 2\\pi k}{4} \\right) = 2 \\left( \\cos \\left( \\frac{\\pi}{3} + \\frac{\\pi k}{2} \\right) + i \\sin \\left( \\frac{\\pi}{3} + \\frac{\\pi k}{2} \\right) \\right)$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 4: Вычисление 4 значений корней ($k = 0, 1, 2, 3$)</strong>\n  <ul>\n    <li><strong>Для $k = 0$:</strong> угол $\\theta_0 = \\frac{\\pi}{3}$\n    $$w_0 = 2 \\left( \\cos \\frac{\\pi}{3} + i \\sin \\frac{\\pi}{3} \\right) = 2 \\left( \\frac{1}{2} + i \\frac{\\sqrt{3}}{2} \\right) = 1 + \\sqrt{3}i$$</li>\n    <li><strong>Для $k = 1$:</strong> угол $\\theta_1 = \\frac{\\pi}{3} + \\frac{\\pi}{2} = \\frac{5\\pi}{6}$\n    $$w_1 = 2 \\left( \\cos \\frac{5\\pi}{6} + i \\sin \\frac{5\\pi}{6} \\right) = 2 \\left( -\\frac{\\sqrt{3}}{2} + i \\frac{1}{2} \\right) = -\\sqrt{3} + i$$</li>\n    <li><strong>Для $k = 2$:</strong> угол $\\theta_2 = \\frac{\\pi}{3} + \\pi = \\frac{4\\pi}{3}$\n    $$w_2 = 2 \\left( \\cos \\frac{4\\pi}{3} + i \\sin \\frac{4\\pi}{3} \\right) = 2 \\left( -\\frac{1}{2} - i \\frac{\\sqrt{3}}{2} \\right) = -1 - \\sqrt{3}i$$</li>\n    <li><strong>Для $k = 3$:</strong> угол $\\theta_3 = \\frac{\\pi}{3} + \\frac{3\\pi}{2} = \\frac{11\\pi}{6}$\n    $$w_3 = 2 \\left( \\cos \\frac{11\\pi}{6} + i \\sin \\frac{11\\pi}{6} \\right) = 2 \\left( \\frac{\\sqrt{3}}{2} - i \\frac{1}{2} \\right) = \\sqrt{3} - i$$</li>\n  </ul>\n</div>",
          "examinerNotes": "Корни образуют квадрат на плоскости с радиусом 2 и вершинами в точках 1 + √3 i, -√3 + i, -1 - √3 i, √3 - i."
        },
        {
          "id": "prob-4-var3",
          "label": "Вариант № 3 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Вычислить:\n$$\\sqrt[4]{\\frac{-8 - 8\\sqrt{3} + (8\\sqrt{3} - 8)i}{1 + i}}$$",
          "quickAnswer": "$$w_0 = \\sqrt{3} + i, \\quad w_1 = -1 + \\sqrt{3}i, \\quad w_2 = -\\sqrt{3} - i, \\quad w_3 = 1 - \\sqrt{3}i$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Избавление от знаменателя</strong>\n  <p>Умножим числитель и знаменатель на $1 - i$:</p>\n  $$z = \\frac{[-8 - 8\\sqrt{3} + (8\\sqrt{3} - 8)i](1 - i)}{2} = -8 + 8\\sqrt{3}i$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Модуль и аргумент</strong>\n  $$r = 16, \\quad \\cos \\varphi = -\\frac{1}{2}, \\quad \\sin \\varphi = \\frac{\\sqrt{3}}{2} \\implies \\varphi = \\frac{2\\pi}{3} \\quad (\\text{II четверть})$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Корни 4-й степени</strong>\n  $$\\sqrt[4]{16} = 2, \\quad \\theta_k = \\frac{\\frac{2\\pi}{3} + 2\\pi k}{4} = \\frac{\\pi}{6} + \\frac{\\pi k}{2}$$\n  <ul>\n    <li>$k = 0$: $w_0 = 2 \\left( \\cos \\frac{\\pi}{6} + i \\sin \\frac{\\pi}{6} \\right) = \\sqrt{3} + i$</li>\n    <li>$k = 1$: $w_1 = 2 \\left( \\cos \\frac{2\\pi}{3} + i \\sin \\frac{2\\pi}{3} \\right) = -1 + \\sqrt{3}i$</li>\n    <li>$k = 2$: $w_2 = 2 \\left( \\cos \\frac{7\\pi}{6} + i \\sin \\frac{7\\pi}{6} \\right) = -\\sqrt{3} - i$</li>\n    <li>$k = 3$: $w_3 = 2 \\left( \\cos \\frac{5\\pi}{3} + i \\sin \\frac{5\\pi}{3} \\right) = 1 - \\sqrt{3}i$</li>\n  </ul>\n</div>",
          "examinerNotes": "Рекомендуемый вариант: идеальные табличные углы π/6, 2π/3, 7π/6, 5π/3."
        },
        {
          "id": "prob-4-var4",
          "label": "Вариант № 4 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Вычислить:\n$$\\sqrt[4]{\\frac{-2 + \\sqrt{3} - (1 + 2\\sqrt{3})i}{4 + 2i}}$$",
          "quickAnswer": "$$w_0 = \\frac{1}{2} + \\frac{\\sqrt{3}}{2}i, \\quad w_1 = -\\frac{\\sqrt{3}}{2} + \\frac{1}{2}i, \\quad w_2 = -\\frac{1}{2} - \\frac{\\sqrt{3}}{2}i, \\quad w_3 = \\frac{\\sqrt{3}}{2} - \\frac{1}{2}i$$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Умножение на $4 - 2i$</strong>\n  <p>Знаменатель: $4^2 + 2^2 = 16 + 4 = 20$.</p>\n  <p>Числитель:</p>\n  $$\\operatorname{Re} = 4(-2 + \\sqrt{3}) - 2(1 + 2\\sqrt{3}) = -8 + 4\\sqrt{3} - 2 - 4\\sqrt{3} = -10$$\n  $$\\operatorname{Im} = -2(-2 + \\sqrt{3}) - 4(1 + 2\\sqrt{3}) = 4 - 2\\sqrt{3} - 4 - 8\\sqrt{3} = -10\\sqrt{3}$$\n  $$z = \\frac{-10 - 10\\sqrt{3}i}{20} = -\\frac{1}{2} - \\frac{\\sqrt{3}}{2}i$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Модуль и аргумент</strong>\n  $$r = 1, \\quad \\varphi = \\frac{4\\pi}{3} \\implies \\theta_k = \\frac{\\pi}{3} + \\frac{\\pi k}{2}$$\n  <ul>\n    <li>$w_0 = \\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$</li>\n    <li>$w_1 = -\\frac{\\sqrt{3}}{2} + \\frac{1}{2}i$</li>\n    <li>$w_2 = -\\frac{1}{2} - \\frac{\\sqrt{3}}{2}i$</li>\n    <li>$w_3 = \\frac{\\sqrt{3}}{2} - \\frac{1}{2}i$</li>\n  </ul>\n</div>",
          "examinerNotes": "Модуль равен единице, все 4 корня лежат на единичной окружности."
        },
        {
          "id": "prob-4-basic",
          "label": "Базовый уровень: Корни из вещественного отрицательного числа",
          "difficulty": "basic",
          "condition": "Вычислить $\\sqrt[3]{-8}$.",
          "quickAnswer": "$w_0 = 1 + \\sqrt{3}i, \\quad w_1 = -2, \\quad w_2 = 1 - \\sqrt{3}i$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <p>$z = -8 = 8(\\cos \\pi + i \\sin \\pi)$. $\\sqrt[3]{8} = 2$.</p>\n  <p>Углы: $\\frac{\\pi + 2\\pi k}{3}$. $k = 0 \\implies 2(\\cos \\frac{\\pi}{3} + i\\sin \\frac{\\pi}{3}) = 1 + \\sqrt{3}i$; $k = 1 \\implies -2$; $k = 2 \\implies 1 - \\sqrt{3}i$.</p>\n</div>",
          "examinerNotes": "Напоминание: в поле комплексных чисел корень нечетной степени из -8 имеет три различных значения, а не только -2!"
        },
        {
          "id": "prob-4-hard",
          "label": "Сложный уровень: Корни 6-й степени",
          "difficulty": "hard",
          "condition": "Вычислить $\\sqrt[6]{\\frac{1 - i\\sqrt{3}}{1 + i}}$.",
          "quickAnswer": "$w_k = \\sqrt[12]{2} \\left( \\cos \\left( -\\frac{7\\pi}{72} + \\frac{\\pi k}{3} \\right) + i \\sin \\left( -\\frac{7\\pi}{72} + \\frac{\\pi k}{3} \\right) \\right), \\quad k = 0, 1, \\dots, 5$",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Тригонометрическая форма числителя и знаменателя</strong>\n  <p>Числитель: $z_1 = 1 - i\\sqrt{3} \\implies |z_1| = \\sqrt{1 + 3} = 2, \\quad \\arg z_1 = -\\frac{\\pi}{3}$.</p>\n  <p>Знаменатель: $z_2 = 1 + i \\implies |z_2| = \\sqrt{1 + 1} = \\sqrt{2}, \\quad \\arg z_2 = \\frac{\\pi}{4}$.</p>\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Модуль и аргумент частного</strong>\n  <p>Модуль частного: $r = \\frac{|z_1|}{|z_2|} = \\frac{2}{\\sqrt{2}} = \\sqrt{2}$.</p>\n  <p>Аргумент частного: $\\varphi = \\arg z_1 - \\arg z_2 = -\\frac{\\pi}{3} - \\frac{\\pi}{4} = -\\frac{7\\pi}{12} \\quad \\left(\\text{или } \\frac{17\\pi}{12}\\right)$.</p>\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Корни 6-й степени по формуле Муавра</strong>\n  <p>Модуль корней: $\\sqrt[6]{r} = \\sqrt[6]{\\sqrt{2}} = \\sqrt[12]{2}$.</p>\n  <p>Все 6 значений корней ($k = 0, 1, 2, 3, 4, 5$):</p>\n  $$w_k = \\sqrt[12]{2} \\left( \\cos \\left( -\\frac{7\\pi}{72} + \\frac{\\pi k}{3} \\right) + i \\sin \\left( -\\frac{7\\pi}{72} + \\frac{\\pi k}{3} \\right) \\right)$$\n</div>",
          "examinerNotes": "Усложненная арифметика с корнями 6-й степени."
        }
      ]
    },
    {
      "id": "task-5-vector-basis",
      "num": 5,
      "code": "№ 5",
      "title": "Базис системы векторов и линейное выражение через него",
      "topic": "Векторные пространства",
      "badge": "Векторы • Базис и ранг",
      "synopsis": "<p>Задание требует найти какую-нибудь максимальную линейно независимую подсистему (базис) заданной системы четырех векторов в пространстве $\\mathbb{R}^4$, определить ранг системы векторов и явно выразить оставшиеся векторы через найденный базис. Решается составлением матрицы из столбцов векторов и приведением ее к ступенчатому виду методом Гаусса над строками.</p>",
      "algorithm": "<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 1</div>\n  <div class=\"algo-step-content\">\n    <strong>Записываем векторы как СТОЛБЦЫ матрицы:</strong>\n    <p>Составляем матрицу $V = (a_1 \\mid a_2 \\mid a_3 \\mid a_4)$, где каждый столбец соответствует одному вектору.</p>\n    <p><em>Почему столбцы?</em> Потому что элементарные преобразования строк не меняют линейных зависимостей между столбцами матрицы!</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 2</div>\n  <div class=\"algo-step-content\">\n    <strong>Прямой ход Гаусса над строками матрицы:</strong>\n    <p>Приводим матрицу к ступенчатому виду (а лучше к приведенному ступенчатому виду RREF, где над ведущими единицами тоже стоят нули).</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 3</div>\n  <div class=\"algo-step-content\">\n    <strong>Определение базиса и ранга:</strong>\n    <p>Столбцы, в которых находятся ступеньки (ведущие элементы), соответствуют линейно независимым векторам. Исходные векторы с этими номерами образуют <strong>базис системы векторов</strong>. Ранг равен числу базисных векторов.</p>\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 4</div>\n  <div class=\"algo-step-content\">\n    <strong>Линейное выражение остальных векторов:</strong>\n    <p>Коэффициенты разложения свободных векторов по базису прямо считываются из столбцов редуцированной матрицы:</p>\n    $$a_4 = c_1 a_{j_1} + c_2 a_{j_2} + \\dots + c_r a_{j_r}$$\n  </div>\n</div>\n<div class=\"algo-step\">\n  <div class=\"algo-step-num\">Шаг 5</div>\n  <div class=\"algo-step-content\">\n    <strong>Проверка:</strong>\n    <p>Подставляем координаты базисных векторов в формулу и проверяем равенство по всем четырем координатам.</p>\n  </div>\n</div>",
      "formattingRules": [
        "Обязательно явно напишите: «Ранг системы векторов равен ...»",
        "Четко укажите выбранный базис: например, «Базис: (a₁, a₂, a₃)».",
        "Запишите линейное разложение: например, a₄ = 2a₁ - a₂."
      ],
      "theoryLinks": [
        {
          "id": "mod-6-vector-spaces",
          "title": "Модуль 6: Векторные пространства и базис"
        },
        {
          "id": "mod-7-rank-theorems",
          "title": "Модуль 7: Ранг матрицы и фундаментальные теоремы"
        },
        {
          "id": "ticket-10",
          "title": "Билет 10: Линейная зависимость и независимость векторов"
        },
        {
          "id": "ticket-12",
          "title": "Билет 12: Базис и координаты"
        }
      ],
      "practiceLinks": [],
      "problems": [
        {
          "id": "prob-5-var2",
          "label": "Вариант № 2 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Найти какой-нибудь базис системы векторов и выразить через этот базис остальные векторы системы:\n$$a_1 = (1, 0, 1, 3), \\quad a_2 = (2, 2, -1, 2), \\quad a_3 = (1, -1, 5, 1), \\quad a_4 = (0, -2, 3, 4)$$",
          "quickAnswer": "Базис: $(a_1, a_2, a_3)$.\nРазложение: $a_4 = 2a_1 - a_2$ (или $a_4 = 2a_1 - a_2 + 0 \\cdot a_3$).",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Составляем матрицу из столбцов векторов</strong>\n  $$V = \\begin{pmatrix} 1 & 2 & 1 & 0 \\\\ 0 & 2 & -1 & -2 \\\\ 1 & -1 & 5 & 3 \\\\ 3 & 2 & 1 & 4 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Элементарные преобразования строк</strong>\n  <p>1. Вычтем $S_1$ из $S_3$ и $3S_1$ из $S_4$ ($S_3 \\to S_3 - S_1, \\; S_4 \\to S_4 - 3S_1$):</p>\n  $$\\begin{pmatrix} 1 & 2 & 1 & 0 \\\\ 0 & 2 & -1 & -2 \\\\ 0 & -3 & 4 & 3 \\\\ 0 & -4 & -2 & 4 \\end{pmatrix}$$\n  <p>2. Приводя матрицу к улучшенному ступенчатому виду (RREF), получаем:</p>\n  $$\\begin{pmatrix} 1 & 0 & 0 & 2 \\\\ 0 & 1 & 0 & -1 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Определение базиса</strong>\n  <p>Ступеньки (ведущие единицы) находятся в 1-м, 2-м и 3-м столбцах. Следовательно, векторы $(a_1, a_2, a_3)$ линейно независимы и образуют <strong>базис системы векторов</strong>. Ранг системы равен 3.</p>\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 4: Выражение вектора $a_4$ через базис</strong>\n  <p>Четвертый столбец матрицы RREF имеет вид $(2, -1, 0, 0)^T$. Отсюда сразу считываются коэффициенты разложения:</p>\n  $$a_4 = 2 a_1 - 1 a_2 + 0 a_3 = 2a_1 - a_2$$\n  <p><strong>Проверка по координатам:</strong></p>\n  $$2a_1 - a_2 = 2(1, 0, 1, 3) - (2, 2, -1, 2) = (2 - 2, \\; 0 - 2, \\; 2 - (-1), \\; 6 - 2) = (0, -2, 3, 4) = a_4$$\n  <p>Равенство в точности выполняется!</p>\n</div>",
          "examinerNotes": "Рекомендуемый вариант для тренировки: идеально целые коэффициенты, проверка занимает 10 секунд."
        },
        {
          "id": "prob-5-var3",
          "label": "Вариант № 3 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Найти какой-нибудь базис системы векторов и выразить через этот базис остальные векторы системы:\n$$a_1 = (1, 3, 2, -2), \\quad a_2 = (2, 0, 1, 1), \\quad a_3 = (1, -1, 1, 1), \\quad a_4 = (3, 1, 4, 0)$$",
          "quickAnswer": "Базис: $(a_1, a_2, a_3)$.\nРазложение: $a_4 = a_1 + 2a_3$ (или $a_4 = a_1 + 0 \\cdot a_2 + 2a_3$).",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Матрица столбцов векторов</strong>\n  $$V = \\begin{pmatrix} 1 & 2 & 1 & 3 \\\\ 3 & 0 & -1 & 1 \\\\ 2 & 1 & 1 & 4 \\\\ -2 & 1 & 1 & 0 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Приведение к RREF</strong>\n  $$\\begin{pmatrix} 1 & 0 & 0 & 1 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 2 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Базис и разложение</strong>\n  <p>Базис: $(a_1, a_2, a_3)$. Ранг системы равен 3.</p>\n  <p>Четвертый столбец дает коэффициенты $(1, 0, 2)^T$:</p>\n  $$a_4 = a_1 + 2a_3$$\n  <p><strong>Проверка:</strong> $(1, 3, 2, -2) + 2(1, -1, 1, 1) = (3, 1, 4, 0) = a_4$. Верно!</p>\n</div>",
          "examinerNotes": "Базис (a₁, a₂, a₃), вектор a₄ = a₁ + 2a₃."
        },
        {
          "id": "prob-5-var4",
          "label": "Вариант № 4 (из реальной КР)",
          "difficulty": "medium",
          "condition": "Найти какой-нибудь базис системы векторов и выразить через этот базис остальные векторы системы:\n$$a_1 = (1, 3, 3, -2), \\quad a_2 = (2, 2, 0, 3), \\quad a_3 = (1, -1, 2, 1), \\quad a_4 = (4, 0, 4, 5)$$",
          "quickAnswer": "Базис: $(a_1, a_2, a_3)$.\nРазложение: $a_4 = a_2 + 2a_3$ (или $a_4 = 0 \\cdot a_1 + a_2 + 2a_3$).",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <strong>Шаг 1: Матрица столбцов</strong>\n  $$V = \\begin{pmatrix} 1 & 2 & 1 & 4 \\\\ 3 & 2 & -1 & 0 \\\\ 3 & 0 & 2 & 4 \\\\ -2 & 3 & 1 & 5 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 2: Приведение к RREF</strong>\n  $$\\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 1 \\\\ 0 & 0 & 1 & 2 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$$\n</div>\n<div class=\"exam-sol-step\">\n  <strong>Шаг 3: Базис и разложение</strong>\n  <p>Базис: $(a_1, a_2, a_3)$. Ранг равен 3.</p>\n  $$a_4 = a_2 + 2a_3$$\n  <p><strong>Проверка:</strong> $(2, 2, 0, 3) + 2(1, -1, 2, 1) = (4, 0, 4, 5) = a_4$.</p>\n</div>",
          "examinerNotes": "Вектор a₁ не входит в разложение a₄ (коэффициент равен 0)."
        },
        {
          "id": "prob-5-basic",
          "label": "Базовый уровень: 3 вектора в R³",
          "difficulty": "basic",
          "condition": "Проверить, образуют ли векторы $a_1 = (1, 2, 3), a_2 = (0, 1, 2), a_3 = (0, 0, 1)$ базис в $\\mathbb{R}^3$.",
          "quickAnswer": "Да, образуют базис (определитель матрицы равен $1 \\neq 0$).",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <p>Матрица ступенчатая, диагональные элементы $1, 1, 1 \\neq 0$. Определитель равен 1, ранг 3. Векторы линейно независимы и образуют базис.</p>\n</div>",
          "examinerNotes": "Базовая проверка на понимание определения базиса."
        },
        {
          "id": "prob-5-hard",
          "label": "Сложный уровень: Система 5 векторов в R⁴",
          "difficulty": "hard",
          "condition": "Найти базис системы 5 векторов в $\\mathbb{R}^4$ и выразить через него остальные векторы.",
          "quickAnswer": "Ранг $\\le 4$, как минимум один вектор обязательно выражается.",
          "fullSolution": "<div class=\"exam-sol-step\">\n  <p>Так как размерность пространства $\\mathbb{R}^4$ равна 4, любые 5 векторов линейно зависимы по основной лемме о линейной зависимости. Максимальный ранг равен 4.</p>\n</div>",
          "examinerNotes": "Вопрос на знание связи размерности пространства и максимального числа независимых векторов."
        }
      ]
    }
  ]
};

const EXAM_VARIANTS = [
  {
    "id": "variant-2",
    "num": 2,
    "title": "Вариант № 2 (из реальной контрольной работы)",
    "level": "medium",
    "levelName": "Средний уровень (⭐ рекомендуемый: готовиться лучше по нему)",
    "taskIds": [
      "prob-1-var2",
      "prob-2-var2",
      "prob-3-var2",
      "prob-4-var2",
      "prob-5-var2"
    ]
  },
  {
    "id": "variant-3",
    "num": 3,
    "title": "Вариант № 3 (из реальной контрольной работы)",
    "level": "medium",
    "levelName": "Средний уровень (⭐ рекомендуемый: готовиться лучше по нему)",
    "taskIds": [
      "prob-1-var3",
      "prob-2-var3",
      "prob-3-var3",
      "prob-4-var3",
      "prob-5-var3"
    ]
  },
  {
    "id": "variant-4",
    "num": 4,
    "title": "Вариант № 4 (из реальной контрольной работы)",
    "level": "medium",
    "levelName": "Средний уровень (⭐ рекомендуемый: готовиться лучше по нему)",
    "taskIds": [
      "prob-1-var4",
      "prob-2-var4",
      "prob-3-var4",
      "prob-4-var4",
      "prob-5-var4"
    ]
  }
];
