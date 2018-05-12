export interface Post {
	_id:string,
	userId:string,
	twitter: {
		username: string,
		displayUrl: string
	},
	title:string,
	body:string,
	url:string
}