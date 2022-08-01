### this is whatsapp_mailing

## npm run init - for init this project and download dependencies

## npm run dev - for start development server


## http://localhost:3500/mailing/postMailing - одноразовая рассылка
пример body:
```js
{
  "numbers": ["+7701 824 11 10", "+7705553 9966"],
  "message": "это тест рассылки"
}
```

## http://localhost:3500/mailing/deleteNumbers - удаление номеров
пример body:
```js
 ["+7701 824 11 10", "+7705553 9966"]
 ```
чтобы очистить базу, оставь массив пустым: []

## http://localhost:3500/mailing/postMailingByMongo - рассылка по номерам в базе
пример body:
```js
{
    "message": "тестовое сообщение рассылки"
}
```

## http://localhost:3500/mailing/postNumbers - добавление номеров
пример body: 
```js
["+7701 824 11 10", "+7705553 9966"]
```