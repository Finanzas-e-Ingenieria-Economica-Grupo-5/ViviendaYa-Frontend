import axios from "axios";
import { PropertyEntity } from "../domain/model/property.entity.js";

const API_URL = import.meta.env.VITE_PROPERTY_ENDPOINT_PATH;

export class PropertyService {
    async getAll() {
        const response = await axios.get(API_URL);
        return response.data.data.map(p => new PropertyEntity(p));
    }

    async create(property) {
        const response = await axios.post(API_URL, property);
        return new PropertyEntity(response.data);
    }

    async update(property) {
        const response = await axios.put(`${API_URL}/${property.id}`, property);
        return new PropertyEntity(response.data);
    }

    async delete(id) {
        await axios.delete(`${API_URL}/${id}`);
        return true;
    }
}

export default new PropertyService();
