class ImageViewer {
  constructor(element) {
    this.picList = $(element).find('.row').first();
    this.selectAllButton = $(element).find('.select-all');
    this.sendButton = $(element).find('.send');
    this.imagePreview = $(element).find('.ui.fluid.image');
    this.showLoadButton = $(element).find('.show-uploaded-files');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображение в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет, у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    this.picList.on('dblclick', 'img', (ev) => {
      this.imagePreview.attr('src', ev.target.src); // Используем jQuery для изменения src
    });

    this.picList.on('click', 'img', (ev) => {
      $(ev.target).toggleClass('selected');
      this.checkButtonText();
    });

    this.selectAllButton.on('click', () => {
      let selectedPic = this.picList.find('img');
      if (!this.picList.find('.selected').length) {
        selectedPic.addClass('selected');
      } else {
        this.picList.find('.selected').removeClass('selected');
      }
      this.checkButtonText();
    });

    this.showLoadButton.on('click', () => {
      App.modals.filePreviewer.open();
      Yandex.getUploadedFiles(function (resp) {
        App.modals.filePreviewer.showImages(resp);
      });
    });

    this.sendButton.on('click', () => {
      App.modals.fileUploader.open();
      let images = [];
      this.picList.find('.selected').each((_, el) => {
        images.push($(el).attr('src'));
      });
      App.modals.fileUploader.showImages(images);
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.picList.find('.four.wide.column.ui.medium.image-wrapper').remove(); // Используем jQuery для удаления элементов
  }

  /**
   * Отрисовывает изображения.
   */
  drawImages(images) {
    this.clear(); // Очищаем блок перед добавлением новых изображений

    if (images.length > 0) {
      this.selectAllButton.removeClass('disabled');
      images.forEach((el) => {
        let imgWrapper = $(`
          <div class="four wide column ui medium image-wrapper">
            <img src="${el}" class="ui fluid image">
          </div>
        `);
        this.picList.append(imgWrapper); // Используем jQuery для добавления элементов
      });
    } else {
      if (!this.selectAllButton.hasClass('disabled')) {
        this.selectAllButton.addClass('disabled');
      }
    }
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    if (this.picList.find('.selected').length > 0) {
      this.selectAllButton.text("Снять выделение");
      this.sendButton.removeClass('disabled');
    } else {
      this.selectAllButton.text("Выбрать всё");
      this.sendButton.addClass('disabled');
    }
  }
}
