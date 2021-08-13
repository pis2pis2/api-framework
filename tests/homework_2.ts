import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import LikeApi from '../src/http/LikeApi';
import { allure } from 'allure-mocha/runtime';
import { after } from 'mocha';
// mocha tests/homework_2.ts -Запуск теста
// npm run report - Запуск отчета

const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;
let randomId;
let numberLikesBefore;
let n=5;
let numberLikesAfter;
let postLikes;
let postLikesDelete;
let numberDislikesBefore;
let m=5;
let numberDislikesAfter;
let responseRandomCat1;
let postDislikes;
let numberLikesAfterRecover;
let numberDislikesAfterRecover;


describe('Провека лайков', async () => {
  before(() => {
    console.log('Запуск тестирования');
  });
  beforeEach('Поиск случайного кота',async() => {
      console.log('Перед началом теста находим кота со случайным id');
    await allure.step('Поиск случайного кота', async() => {
      //Получение случайного id
      const allCats = await CoreApi.getAllCats();
      const randomGroupsNumber = getRandomInt(allCats.data.groups.length);
      const randomCatsNumber = getRandomInt(allCats.data.groups[randomGroupsNumber].cats.length);
      randomId = allCats.data.groups[randomGroupsNumber].cats[randomCatsNumber].id;
      console.log(`Получен случайный ID: ${randomId}`);

      //Получение случайного кота по случайному id
      responseRandomCat1 = await CoreApi.getCatById(randomId);
      console.log(`Получен кот с случайным ID: ${responseRandomCat1.data.cat.name}`);
      // Allure 1
      allure.logStep(`lodStep1 выполнен запрос GET /get-by-id c параметром ${randomId}, до добавления лайков`);
      allure.testAttachment(
        'testAttachment',
        JSON.stringify(responseRandomCat1.data, null, 2),
        'application/json'
      );
      //Проверяем статус код
      assert.equal(responseRandomCat1.status, 200, 'Статус не соответствует');
    });
  });
  afterEach('Возвращаем кол-во лайков в исходное состояние',async () => {
    console.log('Конец теста! Возвращаем кол-во лайков/дизлайков в исходное состояние');
    await allure.step('Возвращаем кол-во лайков в исходное состояние', async() => {
      // Возвращаем кол-во лайков в исходное состояние
      for (let i = 0; i < n; i++) {
        postLikesDelete = await LikeApi.likes(randomId, { like: false, dislike: false });
      }
      //Получение кол-во лайков/дизлайков, после возвращения исходного состояния
      const responseRandomCat4 = await CoreApi.getCatById(randomId);
      numberLikesAfterRecover = responseRandomCat4.data.cat.likes
      numberDislikesAfterRecover = responseRandomCat4.data.cat.dislikes
      console.log(`Кол-во лайков/дизлайков после возвращения: ${numberLikesAfterRecover}/${numberDislikesAfterRecover}`);
    });
  });
  after(() => {
    console.log('Завершение тестирования');
  });
  it('Поставить случайному коту n лайков', async () => {
    await allure.step('Поставить случайному коту n лайков', async() => {
      //Получение кол-ва лайков
      numberLikesBefore = responseRandomCat1.data.cat.likes
      console.log(`Кол-во лайков до: ${numberLikesBefore}`);
      // Allure 2
      allure.logStep(`logStep2 выполнен запрос GET /get-by-id c параметром ${randomId}, получаем кол-во лайков (до) и сохраняем в переменную number_likes_before`);
      allure.testAttachment(
        'testAttachment',
        JSON.stringify(responseRandomCat1.data, null, 2),
        'application/json'
      );
      //Проверяем статус код
      assert.equal(responseRandomCat1.status, 200, 'Статус не соответствует');

      // Поставить n лайков
      for (let i = 0; i < n; i++) {
        postLikes = await LikeApi.likes(randomId, { like: true, dislike: false });
      }
      console.log(`Кол-во лайков, поставленных коту: ${n}`);
      // Allure 3
      allure.logStep(`logStep3 выполнен запрос POST /cats/{catId}/likes c параметром ${randomId} id, добавляем ${n} лайков`);
      allure.testAttachment(
        'testAttachment',
        JSON.stringify(postLikes.data, null, 2),
        'application/json'
      );
      //Проверяем статус код
      assert.equal(postLikes.status, 200, 'Статус не соответствует');

      //Получение кол-во лайков, после проставления лайков
      const responseRandomCat2 = await CoreApi.getCatById(randomId);
      numberLikesAfter = responseRandomCat2.data.cat.likes
      console.log(`Кол-во лайков после: ${numberLikesAfter}`);
      //Проверяем статус код
      assert.equal(responseRandomCat2.status, 200, 'Статус не соответствует');
      // Allure 4
      allure.logStep(`logStep4 выполнен запрос GET /get-by-id c параметром ${randomId}, после добавления лайков`);
      allure.testAttachment(
        'testAttachment',
        JSON.stringify(responseRandomCat2.data, null, 2),
        'application/json'
      );
      //Проверяем, что количество лайков котика соответсвует ожидаемому
      const result = numberLikesBefore + n
      assert.equal(numberLikesAfter, result, 'Кол-во лайков не соответствует ожидаемому результату');
    });
  });
  it('Поставить случайному коту m дизлайков', async () => {
    await allure.step('Поставить случайному коту m дизлайков', async() => {
      //Получение кол-ва лайков
      numberDislikesBefore = responseRandomCat1.data.cat.dislikes
      console.log(`Кол-во дизлайков до: ${numberDislikesBefore}`);
      // Allure 2
      allure.logStep(`logStep2 выполнен запрос GET /get-by-id c параметром ${randomId}, получаем кол-во дизлайков (до) и сохраняем в переменную number_dislikes_before`);
      allure.testAttachment(
        'testAttachment',
        JSON.stringify(responseRandomCat1.data, null, 2),
        'application/json'
      );
      //Проверяем статус код
      assert.equal(responseRandomCat1.status, 200, 'Статус не соответствует');

      // Поставить m дизлайков
      for (let i = 0; i < n; i++) {
        postDislikes = await LikeApi.likes(randomId, { like: false, dislike: true });
      }
      console.log(`Кол-во дизлайков, поставленных коту: ${m}`);
      // Allure 3
      allure.logStep(`logStep3 выполнен запрос POST /cats/{catId}/likes c параметром ${randomId} id, добавляем ${m} дизлайков`);
      allure.testAttachment(
        'testAttachment',
        JSON.stringify(postDislikes.data, null, 2),
        'application/json'
      );
      //Проверяем статус код
      assert.equal(postDislikes.status, 200, 'Статус не соответствует');

      //Получение кол-во дизлайков, после проставления дизлайков
      const responseRandomCat3 = await CoreApi.getCatById(randomId);
      numberDislikesAfter = responseRandomCat3.data.cat.dislikes
      console.log(`Кол-во дизлайков после: ${numberDislikesAfter}`);
      //Проверяем статус код
      assert.equal(responseRandomCat3.status, 200, 'Статус не соответствует');
      // Allure 4
      allure.logStep(`logStep4 выполнен запрос GET /get-by-id c параметром ${randomId}, после добавления дизлайков`);
      allure.testAttachment(
        'testAttachment',
        JSON.stringify(responseRandomCat3.data, null, 2),
        'application/json'
      );
      //Проверяем, что количество дизлайков котика соответсвует ожидаемому
      const result = numberDislikesBefore + m
      assert.equal(numberDislikesAfter, result, 'Кол-во дизлайков не соответствует ожидаемому результату');
    });
  });
});