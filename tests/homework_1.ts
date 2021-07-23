import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
// mocha tests/homework_1.ts -Запуск теста
// npm run report - Запуск отчета

const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;
let random_id;

describe('1) Найти случайного кота 2) Удалить случайного кота (из п.1) 3) Проверить, что случайный кот (из п.1) удален', async () => {
  it('1) Найти случайного кота', async () => {

    //Получение случайного id
    const AllCats = await CoreApi.getAllCats();
    const random_groups_number = getRandomInt(AllCats.data.groups.length);
    const random_cats_number = getRandomInt(AllCats.data.groups[random_groups_number].cats.length);
    random_id = AllCats.data.groups[random_groups_number].cats[random_cats_number].id;
    console.log(`Получен случайный ID: ${random_id}`);

    //Получение случайного кота по случайному id
    const responseRandomCat_1 = await CoreApi.getCatById(random_id);
    console.log(`Получен кот с случайным ID: ${responseRandomCat_1.data.cat.name}`);
    // Allure 1
    allure.logStep(`выполнен запрос GET /get-by-id c параметром ${random_id}`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(responseRandomCat_1.data, null, 2),
      'application/json'
    );

    //Проверяем статус код
    assert.equal(responseRandomCat_1.status, 200, 'Статус не соответствует');
  });

  it('2) Удалить случайного кота (из п.1)', async () => {

    const responseDeleteCat = await CoreApi.removeCat(random_id);
    console.log(`Удален случайный кот (из п.1) с ID ${random_id}`);

    // Allure 2
    allure.logStep(`выполнен запрос DELETE /cats/{catId}/remove c параметром ${random_id}`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(responseDeleteCat.data, null, 2),
      'application/json'
    );

    //Проверяем статус код
    assert.equal(responseDeleteCat.status, 200, 'Статус не соответствует');
  });

  it('3. Проверка, что случайный кот (из п.1) удален', async () => {

    const responseRandomCat_2 = await CoreApi.getCatById(random_id);

    // Allure 3
    allure.logStep(`выполнен запрос GET /get-by-id c параметром ${random_id}`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(responseRandomCat_2.data, null, 2),
      'application/json'
    );

    //Проверяем статус код
    assert.equal(responseRandomCat_2.status, 404, 'Статус не соответствует');
    console.log('Случайный кот (из п.1) не найден (удален)');
  });


});