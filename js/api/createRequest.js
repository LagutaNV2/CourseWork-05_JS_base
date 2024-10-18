/**
 * Основная функция для совершения запросов по Yandex API.
 */
const createRequest = (options = {}) => {
  // Установка cookie перед выполнением запросов
  document.cookie = `remixir=value; SameSite=None; Secure; path=/`;
  console.log('new cookie: ', document.cookie);

  const { method = 'GET', url, headers = {}, data = null, callback } = options;
  console.log('New createRequests HEADERS: ', headers, 'from options.');

  const xhr = new XMLHttpRequest();

  // Конфигурируем запрос с указанным методом и URL
  let requestUrl = url;
  console.log('Конфигурируем запрос с указанным методом: ', method, ' и requestUrl: ', requestUrl);

  // Если тек.метод = GET с неким набором data, добавляем их в строку запроса:

    //  1. переводим data в параметры URL
    //   !!!Новый конструктор!!!
    //    создаёт ***объект URLSearchParams*** из переданного объекта data.
    //    Объект data д.б. вида"ключ-значение" и будет преобразован в строку в формате URL-запроса.
    //    Напр., data = { key1: 'value1', key2: 'value2' } --> параметры URL: "key1=value1&key2=value2"
    //  2. преобразуем объект URLSearchParams в строку (.toString() );
    //  3. добавляем строку к уже существующему URL ( requestUrl += \?${queryParams}``)  ;
    //  4. добавляем "?" ( стандартное разделение в URL );

    // Например, если исходный requestUrl был "https://example.com/api", а параметры запроса
    // получены как "key1=value1&key2=value2", то после выполнения строки requestUrl += \?${queryParams}`;
    // результат будет:"https://example.com/api?key1=value1&key2=value2"`.

  if (method === 'GET' && data) {
    const queryParams = new URLSearchParams(data).toString();
    requestUrl += `?${queryParams}`;
    console.log('получен из data:', data, 'requestUrl:', requestUrl);
  }

  if (method === 'GET' && data=== null) {
    console.log('получен GET data=null', 'requestUrl:', requestUrl);
  }

  // Открываем запрос
  console.log('Открываем запрос с методом: ', method, ' и requestUrl: ', requestUrl, 'headers: ', headers);
  xhr.open(method, requestUrl);

  // 3. Устанавливаем тип ответа JSON
  xhr.responseType = 'json';

  // 4. Устанавливаем заголовки запроса
  // try {
  //   for (const header in headers) {
  //     if (headers.hasOwnProperty(header)) {
  //       xhr.setRequestHeader(header, headers[header]);
  //       console.log('Установлен заголовок:', header, 'значение:', headers[header]);
  //     }
  //   }
  // } catch (err) {
  //   console.log('Ошибка при установке заголовков:', err);
  // }

  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Authorization', 'OAuth ' + Yandex.getToken());
  console.log('4. Установленные заголовки:', headers);



  // Обработка ответа от сервера
  // Стандартная практика для колбэков:
  //    первый аргумент -  ошибка или null (если нет ошибки),
  //    второй аргумент — результат.
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('response = ', xhr.response);
      callback(null, xhr.response);
    } else {
      console.log(' err = ', xhr.status);
      callback(`Ошибка: ${xhr.status} ${xhr.statusText}`, null);
    }
  };

  // Обработка сетевых ошибок
  xhr.onerror = function() {
    console.log('Сетевая ошибка');
    callback('Сетевая ошибка', null);
  };

  // Отправка запроса
  try {
    // Если метод не GET, данные отправляются как тело запроса
    if (method !== 'GET' && data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  } catch (err) {
    // Обработка возможных ошибок при отправке запроса
    console.log(err);
    callback(err, null);
  }
};
