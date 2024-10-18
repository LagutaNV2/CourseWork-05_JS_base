/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.element = $(element);
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){
    // Кнопка "Заменить" — сначала очищаем отрисованные изображения
    const replaceButton = this.element.find('.replace');
    replaceButton.on('click', () => {
      const userId = this.element.find('input').val().trim(); // Получаем ID пользователя
      console.log('User ID: ', userId);
      if (userId) {
        App.imageViewer.clear(); // Очищаем отрисованные изображения
        this.loadImages(userId); // Загружаем изображения для нового пользователя
      } else {
        alert('Пожалуйста, введите ID пользователя.'); // Сообщение, если поле пустое
      }
    });

    // Кнопка "Добавить" — загружаем и добавляем изображения к уже существующим
    const addButton = this.element.find('.add');
    addButton.on('click', () => {
      const userId = this.element.find('input').val().trim(); // Получаем ID пользователя
      if (userId) {
        this.loadImages(userId); // Загружаем и добавляем изображения
      } else {
        alert('Пожалуйста, введите ID пользователя.'); // Сообщение, если поле пустое
      }
    });
  }

  /**
   * Загружает изображения для указанного пользователя
   */
  loadImages(userId) {
    // Выполняем запрос на VK API с помощью метода VK.get
    VK.get(userId, (images) => {
      if (images && images.length > 0) {
        // Проверяем, что массив изображений не пустой
        App.imageViewer.drawImages(images); // Отрисовываем изображения в блоке просмотра
      } else {
        alert('Не удалось получить изображения. Убедитесь, что ID пользователя верен.'); // Сообщение, если изображения не получены
      }
    });

  }

}