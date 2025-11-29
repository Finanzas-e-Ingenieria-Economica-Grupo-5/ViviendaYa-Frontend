import { PropertyType } from "./property-type.enum.js";

export class PropertyEntity {
    constructor({
                    id = null,
                    name = "",
                    price = 0,
                    type = PropertyType.DEPARTMENT,
                    area = 0,
                    location = "",
                } = {}) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.type = type;
        this.area = area;
        this.location = location;
    }
}
