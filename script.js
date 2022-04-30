// Поле, на котором всё будет происходить, — тоже как бы переменная
let canvas = document.getElementById('game');
// Классическая змейка — двухмерная, сделаем такую же
let context = canvas.getContext('2d');
// Размер одной клеточки на поле — 16 пикселей
let grid = 16;
// Служебная переменная, которая отвечает за скорость змейки
let count = 0;
// Количество клеток поля
let playingFieldWidth = canvas.width / grid;
let playingFieldHeight = canvas.height / grid;
let width = canvas.width;
let height = canvas.height;


function initSnake() {
    return {
        // Начальные координаты
        x: canvas.width / 4,
        y: canvas.height / 4,
        // Скорость змейки — в каждом новом кадре змейка смещается по оси Х или У. На старте будет двигаться горизонтально, поэтому скорость по игреку равна нулю.
        dx: grid,
        dy: 0,
        // Тащим за собой хвост, который пока пустой
        cells: [],
        // Стартовая длина змейки — 4 клеточки
        maxCells: 4
    };
}

// А вот и сама змейка
let snake = initSnake();
// А это — еда. Представим, что это серые мышата.
let mouse = {
    // Начальные координаты мыши
    x: canvas.width / 2,
    y: canvas.height / 2
};

// Делаем генератор случайных чисел в заданном диапазоне
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function movieSnake(snake, width, height, grid) {

    // Двигаем змейку с нужной скоростью
    snake.x += snake.dx;
    snake.y += snake.dy;
    // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной строны
    if (snake.x < 0) {
        snake.x = width - grid;
    } else if (snake.x >= width) {
        snake.x = 0;
    }
    // Делаем то же самое для движения по вертикали
    if (snake.y < 0) {
        snake.y = height - grid;
    } else if (snake.y >= height) {
        snake.y = 0;
    }
    // Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку
    snake.cells.unshift({x: snake.x, y: snake.y});
    // Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно освобождает клетки после себя
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    return {x: snake.x, y: snake.y}
}

// Игровой цикл — основной процесс, внутри которого будет всё происходить
function loop() {
    // указываем длину змеи
    context.fillStyle = "gray"
    context.front = "50px Arial"
    context.fillText('snake length ' + snake.maxCells, 20, 60)
    requestAnimationFrame(loop);
    // Функция, которая замедляет скорость игры с 60 кадров в секунду до 10 (60/6 = 10)
    // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет
    if (++count < 10) {
        return;
    }
    // Обнуляем переменную скорости
    count = 0;
    // Очищаем игровое поле
    context.clearRect(0, 0, canvas.width, canvas.height);
    movieSnake(snake, width, height, grid);

    function drawingEat() {
        // Рисуем еду — серую мышь
        context.fillStyle = 'grey';
        context.fillRect(mouse.x, mouse.y, grid - 1, grid - 1);
    }

    drawingEat();

    function eatMouse() {
        // Одно движение змейки — один новый нарисованный квадратик
        context.fillStyle = 'yellow';

        function initMouse() {
            // Помним, что размер холста у нас 600x600, при этом он разбит на ячейки — 40 в каждую сторону
            mouse.x = getRandomInt(0, playingFieldWidth) * grid;
            mouse.y = getRandomInt(0, playingFieldHeight) * grid;
        }

// Обрабатываем каждый элемент змейки
        snake.cells.forEach(function (cell, index) {
            // Чтобы создать эффект клеточек, делаем желтые квадратики меньше на один пиксель, чтобы вокруг них образовалась чёрная граница
            context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
            // Если змейка добралась до еды...
            if (cell.x === mouse.x && cell.y === mouse.y) {
                // увеличиваем длину змейки
                snake.maxCells++;
                // Рисуем новую мышь
                initMouse();
            }
            // Проверяем, не столкнулась ли змея сама с собой
            // Для этого перебираем весь массив и смотрим, есть ли у нас в массиве змейки две клетки с одинаковыми координатами
            for (let i = index + 1; i < snake.cells.length; i++) {
                // Если такие клетки есть — начинаем игру заново
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    // Задаём стартовые параметры основным переменным
                    snake = initSnake()
                    // Ставим еду в случайное место
                    initMouse()
                }
            }
        });
    }

    eatMouse();
}

// Смотрим, какие нажимаются клавиши, и реагируем на них нужным образом
document.addEventListener('keydown', function (e) {
    // Дополнительно проверяем такой момент: если змейка движется, например, влево, то ещё одно нажатие влево или вправо ничего не поменяет — змейка продолжит двигаться в ту же сторону, что и раньше. Это сделано для того, чтобы не разворачивать весь массив со змейкой на лету и не усложнять код игры.
    // Стрелка влево
    // Если нажата стрелка влево, и при этом змейка никуда не движется по горизонтали…
    if (e.key === "ArrowLeft" && snake.dx === 0) {
        // то даём ей движение по горизонтали, влево, а вертикальное — останавливаем
        // Та же самая логика будет и в остальных кнопках
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Стрелка вверх
    else if (e.key === "ArrowUp" && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Стрелка вправо
    else if (e.key === "ArrowRight" && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Стрелка вниз
    else if (e.key === "ArrowDown" && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});
// Запускаем игру
requestAnimationFrame(loop);
