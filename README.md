# Копирование на сервер
  - *Подключится к серверу по ssh или другими методами.*
  - *Установить Nodejs и npm и git*
    ```bash
      $ sudo apt update
      $ sudo apt install nodejs npm git
      Для проверки установки
      $ node -v
      $ npm -v
      $ git --version
    ```
  - *Создать папку проекта в любом удобном месте, рекомендуется в /usr/local/bin/ .СКОПИРОВАТЬ В НЕЕ git репозиторий, при помощи git-clone.*
    ``` bash
      $ git clone {repository URL}
    ```
  - *После копирования репозитория внести изменения в файл конфигурации .env*

# Иницализация
  ```bash
    $ npm install
  ```

# Запуск приложения
  - 
  ```bash
    $ npm run start

    # production mode
    $ npm run start:prod
    
    # watch mode
    $ npm run start:dev
  ```
