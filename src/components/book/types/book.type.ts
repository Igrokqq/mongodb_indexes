type Book = {
	readonly title: string;
	readonly description: string;
	readonly tags: string[];
	readonly genres: string[];
	readonly authors: string[];
	readonly price: number;
	readonly publishedAt: Date;
	readonly language: string;
	readonly pagesCount: number;
  readonly weight: number;
  readonly format: string;
};

export default Book;
