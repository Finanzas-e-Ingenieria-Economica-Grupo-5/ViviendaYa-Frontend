import { Currency, InterestType, CapitalizationType } from './enums.js';

export class SystemConfigEntity {
    constructor({
                    id = 1,
                    currency = Currency.SOLES,
                    interestType = InterestType.NOMINAL,
                    capitalization = CapitalizationType.MENSUAL,
                    gracePeriodMonths = 0,
                    financialInstitutions = []
                } = {}) {
        this.id = id;
        this.currency = currency;
        this.interestType = interestType;
        this.capitalization = capitalization;
        this.gracePeriodMonths = gracePeriodMonths;
        this.financialInstitutions = financialInstitutions;
    }
}