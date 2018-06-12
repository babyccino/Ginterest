import {
	FormControl,
	ValidationErrors
} from '@angular/forms';

export default function imageURLValidator(control: FormControl): Promise<ValidationErrors | null> {
	let url: string = control.value as string,
			img = new Image();
	return new Promise((resolve, reject) => {
		img.onerror = () => resolve(
			{notImage: true}
		);
		img.onload = () => resolve(null);
		img.src = url;
	});
}