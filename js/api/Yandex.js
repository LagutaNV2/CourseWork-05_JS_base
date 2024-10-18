/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   * Токен хранится в локальном хранилище (localStorage).
   * Если токен отсутствует, запрашиваем его у пользователя (prompt) и сохраняем.
   */
  static getToken() {

    let token = localStorage.getItem('yandexToken');

    if (!token) {
      token = prompt('Введите токен для доступа к Yandex Disk:');
      if (token) {
        localStorage.setItem('yandexToken', token);
      } else {
        alert('Токен не был введен. Авторизация не выполнена.');
        return null;   // Возвращаеи null
      }
    }

    return token;      // Возвращаем токен для дальнейшего использования.
  }

  /**
   * Метод загрузки файла в облако: загрузка файла на Яндекс.Диск.
   */
  static uploadFile(path, url, callback) {
    const token = Yandex.getToken();
    if (!token) return;

    createRequest({
      method: 'POST',
      url: `${Yandex.HOST}/resources/upload`,
      headers: {
        'Authorization': `OAuth ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        path: path,       //  `path` (куда загружать)
        url: url         //  `url` (откуда загружать)
      },
      callback: callback
    });
  }

  /**
   * Удаление файла с Яндекс.Диска.
   */
  static removeFile(path, callback) {
    const token = Yandex.getToken();
    if (!token) return;

    createRequest({
      method: 'DELETE',
      url: `${Yandex.HOST}/resources?path=${encodeURIComponent(path)}`,
      headers: {
        'Authorization': `OAuth ${token}`
      },
      callback: callback
    });
  }

  /**
   * Получение всех загруженных файлов с Яндекс.Диска.
   */
  static getUploadedFiles(callback) {
    const token = Yandex.getToken();
    if (!token) return;

    createRequest({
      method: 'GET',
      url: `${Yandex.HOST}/resources/files`,
      headers: {
        'Authorization': `OAuth ${token}`
      },
      callback: callback
    });
  }

  /**
   * Скачивание файла по URL.
   */
  static downloadFileByUrl(fileUrl) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = '';
    link.click();
  }
}