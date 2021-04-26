import * as Faker from 'faker';
import Book from '../../components/book/types/book.type';

export default function mockBookEntity(): Book {
  const emptyValues: string[] = new Array(10).fill('');
  return {
    title: Faker.lorem.word(),
    description: Faker.lorem.text(),
    tags: [...emptyValues.map((): string => Faker.lorem.word())],
    genres: [...emptyValues.map((): string => Faker.music.genre())],
    authors: [...emptyValues.map((): string => Faker.name.findName())],
    price: Faker.datatype.number(),
    publishedAt: Faker.date.past(),
    language: Faker.lorem.word(),
    pagesCount: Faker.datatype.number(),
    weight: Faker.datatype.number(),
    format: `${Faker.datatype.number()}x${Faker.datatype.number()}`,
  };
}
