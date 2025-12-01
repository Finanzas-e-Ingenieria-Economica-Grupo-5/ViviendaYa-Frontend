import axios from "axios";
import { PropertyEntity } from "../domain/model/property.entity.js";

const BASE_URL = import.meta.env.VITE_VIVIENDAYA_PLATFORM_API_URL;
const ENDPOINT = import.meta.env.VITE_PROPERTY_ENDPOINT_PATH;
const API_URL = `${BASE_URL}${ENDPOINT}`;

export class PropertyService {
    async getAll() {
        const response = await axios.get(API_URL);
        // JSON Server devuelve el array directamente
        return response.data.map(p => new PropertyEntity(p));
    }

    async create(property) {
        console.log("Enviando al backend:", property); // Debug
        const response = await axios.post(API_URL, property);
        console.log("Respuesta del backend:", response.data); // Debug
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