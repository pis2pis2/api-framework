import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import LikeApi from '../src/http/LikeApi';
import { allure } from 'allure-mocha/runtime';
// mocha tests/homework_2.2.ts -Запуск теста
// npm run report - Запуск отчета

const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;
let random_id;
let number_dislikes_before;
let m=5;
let number_dislikes_after;
let responseRandomCat_1;
let post_dislikes;

describe('1) Найти случайного кота 2) получить и сохранить кол-во дизлайков' +
  ' 3) поставить ему m дизлайков 4) Проверить, что количество дизлайков котика соответсвует ожидаемому', async () => {
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
    allure.logStep(`выполнен запрос GET /get-by-id c параметром ${random_id}, до добавления дизлайков`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(responseRandomCat_1.data, null, 2),
      'application/json'
    );
    //Проверяем статус код
    assert.equal(responseRandomCat_1.status, 200, 'Статус не соответствует');
  });
  it('2) получить и сохранить кол-во дизлайков', async () => {

    //Получение кол-ва дизлайков
    number_dislikes_before = responseRandomCat_1.data.cat.dislikes
    console.log(`Кол-во дизлайков до: ${number_dislikes_before}`);
    // Allure 2
    allure.logStep(`выполнен запрос GET /get-by-id c параметром ${random_id}, получаем кол-во дизлайков (до) и сохраняем в переменную number_dislikes_before`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(responseRandomCat_1.data, null, 2),
      'application/json'
    );
    //Проверяем статус код
    assert.equal(responseRandomCat_1.status, 200, 'Статус не соответствует');
  });
  it('3) поставить ему(коту) m дизлайков', async () => {
    // Поставить m дизлайков
    for (let i = 0; i < m; i++) {
      post_dislikes = await LikeApi.likes(random_id, { like: false, dislike: true });
    }
    console.log(`Кол-во дизлайков, поставленных коту: ${m}`);
    // Allure 3
    allure.logStep(`выполнен запрос POST /cats/{catId}/likes c параметром ${random_id} id, добавляем ${m} дизлайков`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(post_dislikes.data, null, 2),
      'application/json'
    );
    assert.equal(post_dislikes.status, 200, 'Статус не соответствует');
  });

  it('4) Проверить, что количество дизлайков котика соответсвует ожидаемому', async () => {

    //Получение кол-во дизлайков, после проставления дизлайков
    const responseRandomCat_2 = await CoreApi.getCatById(random_id);
    number_dislikes_after = responseRandomCat_2.data.cat.dislikes
    console.log(`Кол-во дизлайков после: ${number_dislikes_after}`);
    //Проверяем статус код
    assert.equal(responseRandomCat_2.status, 200, 'Статус не соответствует');
    // Allure 4
    allure.logStep(`выполнен запрос GET /get-by-id c параметром ${random_id}, после добавления дизлайков`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(responseRandomCat_2.data, null, 2),
      'application/json'
    );
    //Проверяем, что количество дизлайков котика соответсвует ожидаемому
    const result = number_dislikes_before+m
    assert.equal(number_dislikes_after, result, 'Кол-во дизлайков не соответствует ожидаемому результату');
  });
});