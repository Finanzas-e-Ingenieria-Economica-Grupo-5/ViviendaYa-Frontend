// src/customer/application/customer.store.js

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { CustomerApi } from "../infrastructure/customer.api.js";
import { CustomerAssembler } from "../infrastructure/customer.assembler.js";
import { CustomerEntity } from "../domain/model/customer.entity.js";

const customerApi = new CustomerApi();


const useCustomerStore = defineStore("customer", () => {


    const customers = ref([]);


    const errors = ref([]);


    const customersLoaded = ref(false);


    const customersCount = computed(() =>
        customersLoaded.value ? customers.value.length : 0
    );


    function fetchCustomers() {
        customerApi.getCustomers()
            .then(response => {
                customers.value = CustomerAssembler.toEntitiesFromResponse(response);
                customersLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }


    function getCustomerById(id) {
        const idNum = parseInt(id);
        return customers.value.find(c => c.id === idNum);
    }


    function addCustomer(entity) {
        const resource = CustomerAssembler.toResourceFromEntity(entity);

        customerApi.createCustomer(resource)
            .then(response => {
                const newCustomer = CustomerAssembler.toEntityFromResource(response.data);
                customers.value.push(newCustomer);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }


    function updateCustomer(entity) {
        const resource = CustomerAssembler.toResourceFromEntity(entity);

        customerApi.updateCustomer(resource)
            .then(response => {
                const updated = CustomerAssembler.toEntityFromResource(response.data);
                const index = customers.value.findIndex(c => c.id === updated.id);
                if (index !== -1) customers.value[index] = updated;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }


    function deleteCustomer(entity) {
        customerApi.deleteCustomer(entity.id)
            .then(() => {
                const index = customers.value.findIndex(c => c.id === entity.id);
                if (index !== -1) customers.value.splice(index, 1);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    return {
        customers,
        errors,
        customersLoaded,
        customersCount,

        fetchCustomers,
        getCustomerById,
        addCustomer,
        updateCustomer,
        deleteCustomer
    };
});

export default useCustomerStore;
