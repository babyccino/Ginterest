export interface User {
	_id:string,
	twitter: {
		id: string,
		token: string,
		displayName: string,
		username: string,
		displayUrl: string
	}
}