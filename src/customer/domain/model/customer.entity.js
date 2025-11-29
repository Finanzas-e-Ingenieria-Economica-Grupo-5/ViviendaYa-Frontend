// src/model/CustomerEntity.js

export class CustomerEntity {
    constructor({
                    id = null,
                    firstName = '',
                    lastName = '',
                    email = '',
                    phone = '',
                    income = 0,
                    dependents = 0,
                    employmentStatus = '',
                    maritalStatus = '',
                    segment = 'MiVivienda',
                } = {}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.income = income;
        this.dependents = dependents;
        this.employmentStatus = employmentStatus;
        this.maritalStatus = maritalStatus;
        this.segment = segment;
    }

}
