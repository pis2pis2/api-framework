import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import LikeApi from '../src/http/LikeApi';
import { allure } from 'allure-mocha/runtime';
// mocha tests/homework_2.1.ts -Запуск теста
// npm run report - Запуск отчета

const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;
let random_id;
let number_likes_before;
let n=5;
let number_likes_after;
let responseRandomCat_1;
let post_likes;

describe('1) Найти случайного кота 2) получить и сохранить кол-во лайков' +
  ' 3) поставить ему n лайков 4) Проверить, что количество лайков котика соответсвует ожидаемому', async () => {
  before(() => {
    console.log('Запуск тестирования');
  });
  beforeEach(() => {
    console.log('Начало теста!');
  });
  afterEach(() => {
    console.log('Конец теста!');
  });
  after(() => {
    console.log('Завершение тестирования');
  });
  it('1) Найти случайного кота', async () => {
    //Получение случайного id
    const AllCats = await CoreApi.getAllCats();
    const random_groups_number = getRandomInt(AllCats.data.groups.length);
    const random_cats_number = getRandomInt(AllCats.data.groups[random_groups_number].cats.length);
    random_id = AllCats.data.groups[random_groups_number].cats[random_cats_number].id;
    console.log(`Получен случайный ID: ${random_id}`);

    //Получение случайного кота по случайному id
    responseRandomCat_1 = await CoreApi.getCatById(random_id);
    console.log(`Получен кот с случайным ID: ${responseRandomCat_1.data.cat.name}`);
    // Allure 1
    allure.logStep(`выполнен запрос GET /get-by-id c параметром ${random_id}, до добавления лайков`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(responseRandomCat_1.data, null, 2),
      'application/json'
    );
    //Проверяем статус код
    assert.equal(responseRandomCat_1.status, 200, 'Статус не соответствует');
    });
  it('2) получить и сохранить кол-во лайков', async () => {

    //Получение кол-ва лайков
    number_likes_before = responseRandomCat_1.data.cat.likes
    console.log(`Кол-во лайков до: ${number_likes_before}`);
    // Allure 2
    allure.logStep(`выполнен запрос GET /get-by-id c параметром ${random_id}, получаем кол-во лайков (до) и сохраняем в переменную number_likes_before`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(responseRandomCat_1.data, null, 2),
      'application/json'
    );
    //Проверяем статус код
    assert.equal(responseRandomCat_1.status, 200, 'Статус не соответствует');
    });
  it('3) поставить ему(коту) n лайков', async () => {
      // Поставить n лайков
      for (let i = 0; i < n; i++) {
        post_likes = await LikeApi.likes(random_id, { like: true, dislike: false });
      }
      console.log(`Кол-во лайков, поставленных коту: ${n}`);
    // Allure 3
    allure.logStep(`выполнен запрос POST /cats/{catId}/likes c параметром ${random_id} id, добавляем ${n} лайков`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(post_likes.data, null, 2),
      'application/json'
    );
    //Проверяем статус код
      assert.equal(post_likes.status, 200, 'Статус не соответствует');
    });

  it('4) Проверить, что количество лайков котика соответсвует ожидаемому', async () => {

    //Получение кол-во лайков, после проставления лайков
    const responseRandomCat_2 = await CoreApi.getCatById(random_id);
    number_likes_after = responseRandomCat_2.data.cat.likes
    console.log(`Кол-во лайков после: ${number_likes_after}`);
    //Проверяем статус код
    assert.equal(responseRandomCat_2.status, 200, 'Статус не соответствует');
    // Allure 4
    allure.logStep(`выполнен запрос GET /get-by-id c параметром ${random_id}, после добавления лайков`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(responseRandomCat_2.data, null, 2),
      'application/json'
    );
    //Проверяем, что количество лайков котика соответсвует ожидаемому
    const result = number_likes_before+n
    assert.equal(number_likes_after, result, 'Кол-во лайков не соответствует ожидаемому результату');
  });
});