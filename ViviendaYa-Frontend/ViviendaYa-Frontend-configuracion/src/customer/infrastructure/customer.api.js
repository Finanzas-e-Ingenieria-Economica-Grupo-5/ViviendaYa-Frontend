
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";


const customerEndpointPath = import.meta.env.VITE_CUSTOMERS_ENDPOINT_PATH;


export class CustomerApi extends BaseApi {

    #customerEndpoint;

    constructor() {
        super();
        this.#customerEndpoint = new BaseEndpoint(this, customerEndpointPath);
    }



    getCustomers() {
        return this.#customerEndpoint.getAll();
    }




    getCustomerById(id) {
        return this.#customerEndpoint.getById(id);
    }

    createCustomer(resource) {
        return this.#customerEndpoint.create(resource);
    }

    updateCustomer(resource) {
        return this.#customerEndpoint.update(resource.id, resource);
    }



    deleteCustomer(id) {
        return this.#customerEndpoint.delete(id);
    }
}
