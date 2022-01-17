import { Country } from "./country";

export class Subdivision {
    id!: number;
    country_id!: number;
    subdiv!: string;
    name!: string;
    level!: string;

    /**
     * Function to use for type guard
     */
    private iAmSubdivision() {
        // no-op
    }

    /**
     * Subdivision custom type guard
     */
    public static isSubdivision(obj: any): obj is Subdivision {
        return (obj as Subdivision).iAmSubdivision !== undefined; 
    }

    public static of(id: number, country_id: number, subdiv: string, name: string, level: string) : Subdivision {
        let subdivision: Subdivision = new Subdivision();
        subdivision.id = id;
        subdivision.country_id = country_id;
        subdivision.subdiv = subdiv;
        subdivision.name = name;
        subdivision.level = level;
        return subdivision;
    }

    public static ofIdName(id: number, name: string) : Subdivision {
        return Subdivision.of(id, Country.NO_COUNTRY_ID, "", name, "");
    }

    public static NO_SUBDIVISION_ID: number = 0;
    public static EMPTY_SUBDIVISION: Subdivision = Subdivision.of(Subdivision.NO_SUBDIVISION_ID, Country.NO_COUNTRY_ID, "", "", "");
}
