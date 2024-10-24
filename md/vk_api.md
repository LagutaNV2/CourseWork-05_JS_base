# Использование класса VK для запросов на сервер
Чтобы не возникало проблем с [CORS](https://developer.mozilla.org/ru/docs/Web/HTTP/CORS) изучите [механизм отправки запросов](https://vk.com/dev/api_requests) c использованием JSONP.


В методе `VK.get` необхоимо:
1. Переданный колбек сохранить в свойство `lastCallback` (для дальнейшей обработки).
2. Создать тег `script`, который будет добавляться в документ для выполнения запроса.
3. Настроить тег на запрос [получения изображений профиля](https://vk.com/dev/photos.get). После выполнения запроса наобходимо вызывать метод `VK.processData` для обработки ответа.
4. Добавьте созданный скрипт в тело документа для выполения запроса.

В методе обработки ответа `VK.processData` необходимо выполнить следующие действия:
1. Чтобы документ не засорялся добавленными тегами `script` необходимо найти и удалить тег `script`, который добавлялся для выполнения запроса.
2. В случае возникновения ошибки выводите её в `alert` и завершайте выполнение обработчика ответа от сервера.
3. Найдите самые крупные изображения из ответа от сервера и передайте изображения в колбек, который передавался в метод `VK.get`, который сохранялся в `lastCallback`.
4. Обновите свойство `lastCallback` на функцию "пустышку" `() => {}`.