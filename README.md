### this is whatsapp_mailing

## npm run init - for init this project and download dependencies

## npm run dev - for start development server


## GET http://localhost:3500/mailing/init - QR код в png формате для инициализации whatsapp бота

## POST http://localhost:3500/mailing/postMailing - одноразовая рассылка
пример body:
```js
{
  "numbers": ["77018241110", "77055539966"],
  "message": "это тест рассылки"
}
```

## POST http://localhost:3500/mailing/deleteNumbers - удаление номеров
пример body:
```js
 ["77018241110", "77055539966"]
 ```
чтобы очистить базу, оставь массив пустым: []

## POST http://localhost:3500/mailing/postMailingByMongo - рассылка по номерам в базе
пример body: 
```js
{
    "message": "тестовое сообщение рассылки"
}
```

## POST http://localhost:3500/mailing/postNumbers - добавление номеров
пример body: 
```js
["77018241110", "77055539966"]
```