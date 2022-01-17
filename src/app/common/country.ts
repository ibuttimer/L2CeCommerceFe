export class Country {
    id!: number;
    code!: string;
    name!: string;

    /**
     * Function to use for type guard
     */
    private iAmCountry() {
        // no-op
    }

    /**
     * Country custom type guard
     */
    public static isCountry(obj: any): obj is Country {
        return (obj as Country).iAmCountry !== undefined; 
    }

    public static of(id: number, code: string, name: string) : Country {
        let country: Country = new Country();
        country.id = id;
        country.code = code;
        country.name = name;
        return country;
    }

    public static ofIdName(id: number, name: string) : Country {
        return Country.of(id, "", name);
    }

    public static NO_COUNTRY_ID: number = 0;
    public static EMPTY_COUNTRY: Country = Country.of(Country.NO_COUNTRY_ID, "", "");
}
