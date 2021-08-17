const parametr = {
    url: 'http://api.openweathermap.org/data/2.5',
    sity: 'Санкт-Петербург',
    lang: 'ru',
    app_id: 'ad4e7a534c717944371586c7ca4e4877',
};

// Выбор города
function sity() {
    parametr.sity = document.querySelector('.input').value;
    getDataWeather();
    getDataForecast();
}
document.querySelector('.button').onclick = sity;

getDataWeather();
getDataForecast();


// Получение данных через fetch запрос -getDataWeather
function getDataWeather() {
    fetch(`${parametr.url}/weather?q=${parametr.sity}&lang=${parametr.lang}&appid=${parametr.app_id}`)
        .then(function (resp) { return resp.json() }) //convert data to json - возвращает значение в виде массива
        .then(showDataWeather);
}

function showDataWeather(data) {
    console.log(data);
    document.querySelector('.city').textContent = 'город' + ': ' + data.name;
    document.querySelector('.data').innerHTML = new Date(data.dt * 1000);
    document.querySelector('.temp').innerHTML = 'текущая температура: ' + Math.round(data.main.temp - 273) + '&deg;' + 'C';
    document.querySelector('.weather').textContent = data.weather[0]['description'];
    document.querySelector('.img').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png">`;
    document.querySelector('.temp_min').innerHTML = "<img src='./img/tempMin.png' class='icon'>" + ' минимальная температура: ' + Math.round(data.main.temp_min - 273) + '&deg;' + 'C';
    document.querySelector('.temp_max').innerHTML = "<img src='./img/tempMax.png' class='icon'>" + ' максимальная температура: ' + Math.round(data.main.temp_max - 273) + '&deg;' + 'C';
    document.querySelector('.wind').innerHTML = "<img src='./img/wind.png' class='icon1'>" + ' скорость ветра: ' + data.wind.speed + ' ms';
}

// Получение данных через fetch запрос -getDataForecast
function getDataForecast() {
    fetch(`${parametr.url}/forecast?q=${parametr.sity}&lang=${parametr.lang}&appid=${parametr.app_id}`)
        .then(function (resp) { return resp.json() })
        .then(showDataForecast);
}

function showDataForecast(data) {
    console.log(data);

    // =============== Блок 1 =======================
    // получение исходных элементов массива
    let day_month = 0;
    let number_day = []; //  [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6]
    let day_week = []; //[6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4]
    let min_temp_day = []; //[275.24, 276.07, 277.21, 277.62, .......]
    let max_temp_day = []; //[275.24, 277.73, 278.2, 277.62,  .......]
    for (let i = 0; i < data.list.length; i++) {
        day_month = (new Date(data.list[i]['dt'] * 1000)).getDate();
        day_week[i] = (new Date(data.list[i]['dt'] * 1000)).getDay();

        number_day[i] = day_month;
        min_temp_day[i] = data.list[i]['main']['temp_min'];
        max_temp_day[i] = data.list[i]['main']['temp_max'];
    }

    // =============== Блок 2 ========================
    // получение уникальных элементов массива number_day - узнать какие даты представленны в периоде
    let a = new Set(number_day);
    let number_day_dont_repeat = Array.from(a); //[1, 2, 3, 4, 5, 6]

    // получение уникальных элементов массива day_week - поэтапность дней недели
    let b = new Set(day_week);
    let day_week_dont_repeat = Array.from(b); //[6, 0, 1, 2, 3, 4]

    // создание массива value с кол-вом повторяющихся/одинаковых дней массива - number_day
    let count = 0;
    let count_arr = 0;
    let value = []; // [5, 8, 8, 8, 8, 3]
    for (let j = 0; j < number_day_dont_repeat.length; j++) {

        for (let i = 0; i < number_day.length; i++) {
            if (number_day_dont_repeat[j] === number_day[i]) {
                count++
            }
        }
        value[count_arr] = count;
        count_arr++;
        count = 0;
    }

    // определение уникальных элементов массива min_temp_day по дням недели и запись их в новый массив
    let min_temp_day_dont_repeat = []; //[273.57, 274.01, 272.78, 273.52, 273.57, undefined]
    let sum_value = 0;
    let sum_value_arr = []; // [4, 12, 20, 28, 36, 40]

    for (let i = 0; i < value.length; i++) {
        sum_value += value[i];
        sum_value_arr[i] = sum_value;
    }

    for (let i = 0; i < value.length; i++) {
        min_temp_day_dont_repeat[i] = min_temp_day[sum_value_arr[i]];
        for (let j = sum_value_arr[i]; j < sum_value_arr[i + 1]; j++) {  //sum_value_arr[i + 1]
            if (min_temp_day[j] < min_temp_day_dont_repeat[i]) {
                min_temp_day_dont_repeat[i] = min_temp_day[j]
            }
        }
    }
    min_temp_day_dont_repeat.unshift(0);

    // определение уникальных элементов массива max_temp_day по дням недели и запись их в новый массив
    let max_temp_day_dont_repeat = []; //[273.57, 274.01, 272.78, 273.52, 273.57, undefined]

    for (let i = 0; i < value.length; i++) {
        max_temp_day_dont_repeat[i] = max_temp_day[sum_value_arr[i]];
        for (let j = sum_value_arr[i]; j < sum_value_arr[i + 1]; j++) {  //sum_value_arr[i + 1]
            if (max_temp_day[j] > max_temp_day_dont_repeat[i]) {
                max_temp_day_dont_repeat[i] = max_temp_day[j]
            }
        }
    }
    max_temp_day_dont_repeat.unshift(0);


    // =============== Блок 3 =======================
    // Создание объекта с определением дней недели
    const day = {
        0: 'Вс',
        1: 'Пн',
        2: 'Вт',
        3: 'Ср',
        4: 'Чт',
        5: 'Пт',
        6: 'Сб'
    }

    // Заполнение div.data-element - день недели и число
    for (let i = 1; i < 5; i++) {
        for (let key in day) {
            if (day_week_dont_repeat[i] == key) {
                document.getElementById('date_' + i).innerHTML = day[key] + ', ' + number_day_dont_repeat[i];
            }
        }
    }

    // Заполнение div.data-element- min maxTemp
    for (let i = 1; i < 5; i++) {
        document.getElementById('minTemp_' + i).innerHTML = "<img src='./img/tempMin.png' class='icon'>" + "  " + Math.round(min_temp_day_dont_repeat[i] - 273) + '&deg;' + 'C';
    }

    for (let i = 1; i < 5; i++) {
        document.getElementById('maxTemp_' + i).innerHTML = "<img src='./img/tempMax.png' class='icon'>" + "  " + Math.round(max_temp_day_dont_repeat[i] - 273) + '&deg;' + 'C';
    }

};





























// ====Initialize Swiper===
function Swiper() {
    var swiper = new Swiper('.swiper-container', {
        effect: 'cube',
        grabCursor: true,
        cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
            direction: 'horizontal',
            loop: false,
        },
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });




}







