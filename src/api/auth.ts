import { APIURL } from "../constants";

export function fetchUserData(token: string) {
	return new Promise((resolve, reject) => {
		const headers = new Headers();
		headers.set("Authorization", token);
		fetch(`${APIURL}/@me`, {
			headers,
		})
			.then(async (response) => {
				if (response.ok === false) {
					return reject(response.status);
				}
				try {
					let result = await response.json();
					return resolve(result);
				} catch (e) {
					return reject(e);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function loginWithUsernamePasswordAPI(
	username: string,
	password: string,
	remember: boolean
): Promise<string> {
	return new Promise((resolve, reject) => {
		const body = {
			username,
			password,
			remember,
		};

		fetch(`${APIURL}/login`, {
			body: JSON.stringify(body),
			method: "POST",
		})
			.then(async (response) => {
				if (response.ok === false) {
					return reject(response.status);
				}
				try {
					let json = await response.json();
					return resolve(json.token);
				} catch (e) {
					return reject(e);
				}
			})
			.catch(reject);
	});
}
