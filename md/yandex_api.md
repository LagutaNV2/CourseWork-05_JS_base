# Использование класса Yandex для запросов на сервер
Для взаимодействия с API Yandex could используется класс Yandex.
Все запросы выполняются с помощью функции `createRequest`.
Документацию по использованию Яндекс диска можно изучить на [полигоне]
(https://yandex.ru/dev/disk/poligon/).
Статическое свойство `HOST` инициализируйте значением:
 `'https://cloud-api.yandex.net/v1/disk'`.
*******************************************************
* Метод `getToken`
* используется для получения токена авторизации в Yandex.
* Токен должен храниться в локальном хранилище страницы.
* Если токен отсутствует в локальном хранилище,
* то пользователь должен ввести токен с помощью команды `prompt`
* (введёный токен сохраняйте в localStorage, чтобы не заставлять
* пользователя каждый раз вводить токен).
*
*******************************************************
* Методы `uploadFile`, `removeFile` и `getUploadedFiles`
* должны выполнять запросы на ЯДиск.
1. Для загрузки файлов (`uploadFile`):
    1. метод `POST`
    2. путь `'/resources/upload'`
    3. даныне для запроса :
         `path` (куда загружать) и `url` (откуда загружать)
2. Для загрузки файлов (`removeFile`):
    1. метод `DELETE`
    2. путь `'/resources'`
    3. даныне для запроса `path` (откуда удалять)
3. Для получения всех загруженных файлов (`getUploadedFiles`):
    1. метод `GET`
    2. путь `'/resources/files'`
    3. даныне для запроса отсутствуют
4. Для всех запросов:
    1. Необходимо использовать заголовок `Authorization` со значением `'OAuth '` и токеном (из локального хранилища)
    2. Передавайте колбек для обработки ответа.

* Для скачивания файлов используйте метод `downloadFileByUrl`. Этот метод не должен обращаться к серверу. Путь к файлу передаётся аргументом. Необходимо только сохранить файл по этому передаваемому пути, для этого:
1. Создайте элемент ссылки.
2. Настройте ссылку на полученый путь к изображению.
3. Инициируйте клик по созданной ссылке с помощью метода `click`.