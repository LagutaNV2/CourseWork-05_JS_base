class ImageViewer {
  constructor(element) {
    this.imagesList = $(element).find('.row').first();
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
   * 3. Клик по кнопке выделения всех изображений проверяет и добавляет/удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    // 1. меняем класс активности у изображения
    this.imagesList.on('click', 'img', (ev) => {
      $(ev.target).toggleClass('selected');
      this.checkButtonText();
    });

    // 2. отображаем изображение в блоке предпросмотра
    this.imagesList.on('dblclick', 'img', (ev) => {
      console.log('изменение src ui.fluid.image на ', ev.target.src)
      this.imagePreview.attr('src', ev.target.src);
    });

    // 3. добавляем/удаляем класс активности
    this.selectAllButton.on('click', () => {
      let selectedImg = this.imagesList.find('img');
      if (!this.imagesList.find('.selected').length) {
        selectedImg.addClass('selected');
      } else {
        this.imagesList.find('.selected').removeClass('selected');
      }

      this.checkButtonText();
    });

    // 4. открываем всплывающее окно просмотра загруженных файлов
    this.showLoadButton.on('click', () => {
      console.log('вызываем загрузчик фото из ЯД и App.modals.filePreviewer.open()');
      App.modals.filePreviewer.open();
      Yandex.getUploadedFiles(function(err, response) {
        if (err) {
          console.error('Ошибка при получении загруженных файлов:', err);
          return;
        }

        // Проверяем наличие изображений
        const images = response.items;
        if (images && images.length > 0) {
          App.modals.filePreviewer.showImages(images);
        } else {
          console.log('Нет изображений для отображения.');
          const modalContent = App.modals.filePreviewer.element.find('.content');
          modalContent.html('<p>На Yandex Disk нет изображений для отображения.</p>');

          // Закрываем окно с задежкой 5 сек.
          setTimeout(() => {
            App.modals.filePreviewer.close();
          }, 5000);
        }
      });
    });

    // 5. открываем всплывающее окно для загрузки файлов
    this.sendButton.on('click', () => {
      App.modals.fileUploader.open();
      let images = [];
      this.imagesList.find('.selected').each((_, el) => {
        images.push($(el).attr('src'));
      });
      console.log('images for send: ', images);
      App.modals.fileUploader.showImages(images);
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.imagesList.find('.four.wide.column.ui.medium.image-wrapper').remove();
  }

  /**
   * Отрисовывает изображения.
   */
  drawImages(images) {
    this.clear();

    if (images.length > 0) {
      this.selectAllButton.removeClass('disabled');
      images.forEach((el) => {
        let imgWrapper = $(`
          <div class="four wide column ui medium image-wrapper">
            <img src="${el}" class="ui fluid image">
          </div>
        `);
        this.imagesList.append(imgWrapper);
      });
    } else {
      if (!this.selectAllButton.hasClass('disabled')) {
        // this.selectAllButton.addClass('disabled'); устаревший метод вставки!
        this.imagesList[0].insertAdjacentHTML('beforeend', imgWrapper);
      }
    }
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    if (this.imagesList.find('.selected').length > 0) {
      this.selectAllButton.text("Снять выделение");
      this.sendButton.removeClass('disabled');
    } else {
      this.selectAllButton.text("Выбрать всё");
      this.sendButton.addClass('disabled');
    }
  }
}
