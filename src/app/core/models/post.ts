export interface Post {
	id: string,
	userId: string,
	twitter: {
		username: string,
		displayUrl: string
	},
	title: string,
	url: string,
	body: string,
	createdAt: Date
}