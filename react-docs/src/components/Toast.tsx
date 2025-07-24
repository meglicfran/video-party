function Toast() {
	return <div id="toast" className="hidden"></div>;
}

export function showToast(message: string) {
	const toast = document.getElementById("toast");
	if (!toast) {
		throw new Error("No toast element found!");
	}

	toast.textContent = message;
	toast.classList.remove("hidden");
	setTimeout(() => toast.classList.add("hidden"), 3000);
}

export default Toast;
