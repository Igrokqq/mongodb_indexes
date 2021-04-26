declare type LookupOptions = {
	readonly from: string;
	readonly localField?: string;
	readonly foreignField?: string;
	readonly as: string;
	readonly pipeline?: object[];
}
