/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  // 1. Конструктор
  constructor(element) {
    super(element);
    this.registerEvents();
  }

  /**
   * 2. Метод `registerEvents` добавляет следующие обработчики событий:
   * 2.1. Клик по крестику на всплывающем окне, закрывает его
   * 2.2. Клик по контроллерам изображения:
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    // 2.1. Клик по иконке крестика для закрытия модального окна
    console.log('закрываем окно "обозреватель облака на YD" ')
    this.element.find('.x.icon').on('click', () => this.close());

    // 2.2. Вешаем обработчик на контент, чтобы отслеживать клики по всем изображениям
    this.element.find('.content').on('click', (event) => {
      const target = $(event.target);

      // 2.2.1  клик по кнопке удаления (с классом .delete)
      if (target.hasClass('delete')) {
        const deleteButton = target;

        // Получаем путь к файлу через атрибут data-path:
        // <button class="ui labeled icon red basic button delete" data-path='PPP'>
        const filePath = deleteButton.data('path');

        // Добавляем индикатор загрузки на иконку и блокируем кнопку
        deleteButton.addClass('disabled');
        deleteButton.find('i').addClass('icon spinner loading');

        // Выполняем запрос на удаление файла с Яндекс.Диска
        Yandex.removeFile(filePath, (err, response) => {
          if (response === null) {
            // Успешное удаление: убираем блок с изображением
            console.log('Успешное удаление из YD: ', filePath)
            deleteButton.closest('.image-preview-container').remove();

            // Если больше нет изображений, закрываем модальное окно
            if (this.element.find('.image-preview-container').length === 0) {
              console.log('больше нет изображений на YD')
              this.close();
            }
          } else {
            // Если произошла ошибка, выводим её
            alert(`Ошибка при удалении файла: ${err}`);
          }
        });
      }

      // 2.2.2  по кнопке скачивания (с классом .download)
      if (target.hasClass('download')) {
        const downloadButton = target;

        // Получаем URL файла для скачивания:
        // <button class="ui labeled icon violet basic button download" data-file='FFF'>
        const fileUrl = downloadButton.data('file');

        // Используем Yandex API для скачивания файла по URL
        Yandex.downloadFileByUrl(fileUrl);
      }
    });
  }

  /**
   * 3. метод отображает переданные изображения в модальном окне.
   */
  showImages(images) {
    console.log('showImages получил images ', images);

    const reversedImages = images.reverse();

    // Для каждого изображения создаём HTML-разметку:
    // блок контейнер (с изображением, полем ввода и кнопкной загрузки)
    const imageContent = reversedImages.map(image => this.getImageInfo(image)).join('');

    // Устанавливаем созданную разметку в элемент .content модального окна
    this.element.find('.content').html(imageContent);
  }

  /**
   * 4. метод преобразует дату из ISO-формата в человеко-читаемый формат.
   */
  formatDate(dateISO) {
    const date = new Date(dateISO); // Преобразуем строку в объект даты

    // Форматируем дату в виде "день месяц год в час:минуты"
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) + ` в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  }

  /**
   * 5. метод возвращает HTML-разметку для одного изображения с информацией о нём.
   */
  getImageInfo(image) {

    const { name, created, size, path, file } = image;

    console.log('Извлекаем данные из объекта изображения', image);
    console.log('name, created, size: ', name, created, size);
    console.log('filePath: ', path);
    console.log('fileUrl: ', file);

    const formattedDate = this.formatDate(created);
    const sizeKB = (size / 1024).toFixed(2);

    return `
      <div class="image-preview-container">
        <img src='${file}' alt="${name}" />
        <table class="ui celled table">
          <thead>
            <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
          </thead>
          <tbody>
            <tr><td>${name}</td><td>${formattedDate}</td><td>${sizeKB} КБ</td></tr>
          </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path='${path}'>
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file='${file}'>
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>`;
  }
}