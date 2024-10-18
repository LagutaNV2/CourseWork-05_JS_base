class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);

    // Инициализируем элементы с использованием jQuery
    this.xIcon = $(element).find('.x.icon');
    this.closeButton = $(element).find('.close');
    this.scrollContent = $(element).find('.scrolling.content');
    this.sendButton = $(element).find('.send-all');

    // Регистрируем события
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {
    // Клик по крестику для закрытия окна
    this.xIcon.on('click', () => {
      App.modals.fileUploader.close();
    });

    // Клик по кнопке "Закрыть" для закрытия окна
    this.closeButton.on('click', () => {
      App.modals.fileUploader.close();
    });

    // Обработчик клика по кнопке отправки изображения
    this.scrollContent.on('click', '.ui.button', (ev) => {
      this.sendImage($(ev.target).closest('.image-preview-container'));
    });

    // Клик по кнопке "Отправить все файлы"
    this.sendButton.on('click', () => {
      this.sendAllImages();
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    images.reverse();
    let markup = images.map(img => this.getImageHTML(img)).join('');
    this.scrollContent.html(markup); // Используем метод jQuery html()
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкой загрузки
   */
  getImageHTML(item) {
    return `
      <div class="image-preview-container">
        <img src="${item}" class="ui fluid image"/>
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу" />
          <button class="ui button"><i class="upload icon"></i></button>
        </div>
      </div>`;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    this.scrollContent.find('.image-preview-container').each((_, el) => {
      this.sendImage($(el)); // Используем jQuery для обработки каждого изображения
    });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const input = imageContainer.find('input[type="text"]');
    let filePath = input.val().trim().replace(/[<,>,"]/g, "_");

    if (filePath) {
      imageContainer.find('.action').addClass('disabled'); // Блокируем элемент во время отправки
      let url = imageContainer.find('img').attr('src'); // Получаем URL изображения

      Yandex.uploadFile(filePath, url, () => {
        imageContainer.remove(); // Удаляем элемент после успешной отправки

        // Если все изображения отправлены, закрываем модальное окно
        if (this.scrollContent.children().length === 0) {
          App.modals.fileUploader.close();
        }
      });
    } else {
      imageContainer.find('.action').addClass('error'); // Добавляем класс ошибки, если путь пуст
    }
  }
}
