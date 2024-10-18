/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * ACCESS_TOKEN  токен доступа к API VK (должен быть получен заранее)
 * lastCallback - хранит последнюю callback-функцию, переданную в метод get
 * ключевое слово static используется для определения статических
 * свойств или методов класса.
 * Такие свойства и методы принадлежат самому классу,
 * а не его экземплярам.
 * */
class VK {
  // static ACCESS_TOKEN = '958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008';
  static ACCESS_TOKEN = "a2d8951fa2d8951fa2d8951fb5a1cd61e5aa2d8a2d8951fc7f2f5d100529d9273d07859";
  static lastCallback;

  static get(id = '', callback){

    // 1. Переданный колбек сохранить в свойство `lastCallback` (для дальнейшей обработки).
    VK.lastCallback = callback;

    // 2. Создать тег `script`, который будет добавляться в документ для выполнения JSONP запроса.
    const script = document.createElement('script');

    // 3. Настроить тег на запрос [получения изображений профиля](https://vk.com/dev/photos.get).:
    // - формируем URL для запроса к VK API на получение фото;
    // - используем метод photos.get, чтобы получить фотографии профиля пользователя;
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&access_token=${VK.ACCESS_TOKEN}&v=5.199&callback=VK.processData`;

    // 4. Добавляем созданный элемент <script> в тело документа, что инициирует запрос.
    document.body.appendChild(script);
    console.log('отправляем запрос на vk ', script.src)

  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   */
  static processData(result){
    console.log('VK.js result=', result)
    // 1. Удаляем <script> тег, чтобы он не засорял документ:
    // ищем тот, у которого URL запроса в атрибуте src включает "photos.get"
    const script = document.querySelector(`script[src*="photos.get"]`);
    if (script) {
      console.log('удаляем элемент, созданный для запроса на vk ', script.src)
      script.remove();
    }

    // 2. Проверяем, есть ли ошибка в ответе.
    if (result.error) {
      // Если произошла ошибка, выводим сообщение с её текстом и выходим из функции.
      alert(`Ошибка: ${result.error.error_msg}`);
      return; // Завершаем выполнение метода.
    }

    // 3. Обрабатываем успешный ответ:
    // Извлекаем массив фотографий из ответа.
    const photos = result.response.items;
    console.log('photos=', photos)

    // Если нет фотографий, возвращаем пустой массив в callback.
    if (!photos.length) {
      VK.lastCallback([]);
      VK.lastCallback = () => {}; // Сбрасываем callback на "пустышку".
      return;
    }

    // Находим самые крупные версии изображений:

    // - метод .map() проходит по каждому элементу массива photos и
    //            создает новый массив, применяя callback;
    // - photos — это массив объектов - фотографий, и у каждой фотографии
    //            есть массив с различными размерами (photo.sizes);
    // - Каждый объект в массиве sizes содержит информацию о картинке:
    //            width, height, url;
    // - Метод reduce() ищет один элемент из массива sizes,  самый крупный (по ширине),
    //    выполняя функцию callback ("reducer") один раз для каждого элемента массива,
    //    за исключением пустот, в порядке возрастания индекса и накапливает их в одно значение
    //    принимает 4 аргумента:
    //     1)начальное значение или значение от предыдущего вызова callback (largestSize),
    //     2)значение текущего элемента (currentSize),
    //     3)текущий индекс,
    //     4)массив, по которому происходит итерация.


    const largestPhotos = photos.map(photo => {

      const largest = photo.sizes.reduce((largestSize, currentSize) => {

        return currentSize.width > largestSize.width ? currentSize : largestSize;
      });

      return largest.url; // Возвращаем URL самого крупного изображения.
    });

    // 4. Передаем массив larg foto (url) в callback, который был передан в метод get, для выполнения
    // например, выполнения функции вывода этих фото на страницу
    VK.lastCallback(largestPhotos);

    // 5. После выполнения callback сбрасываем его значение на пустую функцию.
    VK.lastCallback = () => {};
  }


}
