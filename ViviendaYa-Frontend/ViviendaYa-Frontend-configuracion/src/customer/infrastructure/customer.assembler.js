import { CustomerEntity } from "../domain/model/customer.entity.js";

export class CustomerAssembler {

    static toEntityFromResource(resource) {
        return new CustomerEntity({
            id: resource.id ?? null,
            firstName: resource.firstName,
            lastName: resource.lastName,
            email: resource.email,
            phone: resource.phone,
            income: resource.income,
            dependents: resource.dependents,
            employmentStatus: resource.employmentStatus,
            maritalStatus: resource.maritalStatus,
            segment: resource.segment,
        });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        return (response.data || []).map(resource => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(entity) {
        const resource = {
            id: entity.id,
            firstName: entity.firstName,
            lastName: entity.lastName,
            email: entity.email,
            phone: entity.phone,
            income: entity.income,
            dependents: entity.dependents,
            employmentStatus: entity.employmentStatus,
            maritalStatus: entity.maritalStatus,
            segment: entity.segment,
        };

        if (resource.id == null) {
            delete resource.id;
        }

        return resource;
    }

    static toResourcesFromEntities(entities) {
        return entities.map(entity => this.toResourceFromEntity(entity));
    }
}
