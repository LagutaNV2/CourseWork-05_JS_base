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
        App.imageViewer.clear();
        this.loadImages(userId);
      } else {
        alert('Пожалуйста, введите ID пользователя.');
      }
    });

    // Кнопка "Добавить" — загружаем и добавляем изображения к уже существующим
    const addButton = this.element.find('.add');
    addButton.on('click', () => {
      const userId = this.element.find('input').val().trim(); // Получаем ID пользователя
      if (userId) {
        this.loadImages(userId); // Загружаем и добавляем изображения
      } else {
        alert('Пожалуйста, введите ID пользователя.');
      }
    });
  }

  /**
   * Загружает изображения для указанного пользователя
   */
  loadImages(userId) {
    // запрос на VK API
    VK.get(userId, (images) => {
      if (images && images.length > 0) {
        App.imageViewer.drawImages(images);
      } else {
        alert('Не удалось получить изображения. Убедитесь, что ID пользователя верен.');
      }
    });
  }
}