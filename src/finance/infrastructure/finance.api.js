const BASE_URL = "https://fakeapi-vivendaya.onrender.com/finance";

export const financeApi = {
    async saveFinanceResult(data) {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        return await res.json();
    },

    async getAll() {
        const res = await fetch(BASE_URL);
        return await res.json();
    }
};
