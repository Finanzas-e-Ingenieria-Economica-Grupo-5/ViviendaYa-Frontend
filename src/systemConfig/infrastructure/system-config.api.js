import { BaseApi } from "../../shared/infrastructure/base-api.js";

export class SystemConfigApi extends BaseApi {

    async getConfig() {
        const res = await this.http.get('/system-config/1');
        return res.data;
    }

    async saveConfig(data) {
        const res = await this.http.put('/system-config/1', {
            id: 1,
            ...data
        });
        return res.data;
    }

}
