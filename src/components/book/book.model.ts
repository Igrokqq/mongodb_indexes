import {
	Schema,
	Document,
	Model,
	Connection as MongooseConnection,
} from 'mongoose';
import Book from './types/book.type';

export type BookEntity = Document & Book;

export const getModel = (connection: MongooseConnection): Model<BookEntity> => connection.model('BookModel', new Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			required: true,
		},
		tags: {
			type: Array,
			custom(tags: unknown[]): boolean {
				return tags.every((tag: unknown): boolean => typeof tag === 'string' && !!tag.length);
			},
			required: true,
		},
		genres: {
			type: Array,
			custom(genres: unknown[]): boolean {
				return genres.every((genre: unknown): boolean => typeof genre === 'string' && !!genre.length);
			},
			required: true,
		},
		authors: {
			type: Array,
			custom(authors: unknown[]): boolean {
				return authors.every((author: unknown): boolean => typeof author === 'string' && !author.length);
			},
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		publishedAt: {
			type: Date,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		pagesCount: {
			type: Number,
			required: true,
		},
		weight: {
			type: Number,
			required: true,
		},
		format: {
			type: String,
			custom(format: unknown): boolean {
				if (typeof format !== 'string') {
					return false;
				}

				const [width, height] = format.toLowerCase().split('x').map((value: unknown): number | unknown => {
					if (typeof value === 'string') {
						return parseInt(value, 10);
					}
					return value;
				});

				return Number.isInteger(width) && Number.isInteger(height);
			},
			required: true,
		},
	},
	{
		collection: 'books',
		versionKey: false,
		timestamps: true,
	},
));
