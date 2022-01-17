import { AbstractControl, AbstractControlOptions, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Country } from "../common/country";
import { Subdivision } from "../common/subdivision";


const REQUIRED = 'required'
const MIN_LENGTH = 'minLength'
const MAX_LENGTH = 'maxLength'
const MIN_VALUE = 'min'
const MAX_VALUE = 'max'
const NOT_ONLY_WHITESPACE = 'notOnlyWhitespace'
const PATTERN = 'pattern'
const NOT_INVALID_ID = 'notInvalidId'


export function notOnlyWhitespace() : ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let result = false;
        if (control.value != null) {
            result = control.value.trim().length === 0;
        }
        return result ? {notOnlyWhitespace: true} : null;
      };
}

export function notInvalidId() : ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let result = false;
        if (control.value != null) {
            if (Country.isCountry(control.value)) {
                result = control.value.id === Country.NO_COUNTRY_ID;
            } else if (Subdivision.isSubdivision(control.value)) {
                result = control.value.id === Subdivision.NO_SUBDIVISION_ID;
            }
        }
        return result ? {notInvalidId: true} : null;
      };
}


export class ValidatorList {

    private _map: Map<string, any>;

    constructor() {
        this._map = new Map<string, any>([
            [REQUIRED, false],
            [MIN_LENGTH, null],
            [MAX_LENGTH, null],
            [MIN_VALUE, null],
            [MAX_VALUE, null],
            [NOT_ONLY_WHITESPACE, false],
            [PATTERN, null],
            [NOT_INVALID_ID, false],
        ]);
    }

    public static of(): ValidatorList {
        return new ValidatorList();
    }

    setRequired(value: boolean): ValidatorList {
        this._map.set(REQUIRED, value);
        return this;
    }

    setMinLength(minLength: number): ValidatorList {
        this._map.set(MIN_LENGTH, minLength);
        return this;
    }

    setMaxLength(maxLength: number): ValidatorList {
        this._map.set(MAX_LENGTH, maxLength);
        return this;
    }

    setMin(min: number): ValidatorList {
        this._map.set(MIN_VALUE, min);
        return this;
    }

    setMax(max: number): ValidatorList {
        this._map.set(MAX_VALUE, max);
        return this;
    }

    setNotOnlyWhitespace(value: boolean): ValidatorList {
        this._map.set(NOT_ONLY_WHITESPACE, value);
        return this;
    }

    setPattern(pattern: string | RegExp | null): ValidatorList {
        this._map.set(PATTERN, pattern);
        return this;
    }

    setNotInvalidId(value: boolean): ValidatorList {
        this._map.set(NOT_INVALID_ID, value);
        return this;
    }

    get list(): ValidatorFn | ValidatorFn[] | AbstractControlOptions {
        let result: ValidatorFn[] = [];
    
        for (const [key, value] of this._map.entries()) {
            switch (key) {
                case REQUIRED:
                    if (value) {
                        result.push(Validators.required)
                    }
                    break;
                case MIN_LENGTH:
                case MAX_LENGTH:
                case MIN_VALUE:
                case MAX_VALUE:
                    if (typeof value == 'number' && value >= 0) {
                        let validator = null;
                        switch (key) {
                            case MIN_LENGTH:
                                validator = Validators.minLength(value);
                                break;
                            case MAX_LENGTH:
                                validator = Validators.maxLength(value);
                                break;
                            case MIN_VALUE:
                                validator = Validators.min(value);
                                break;
                            case MAX_VALUE:
                                validator = Validators.max(value);
                                break;
                        }
                        if (validator != null) {
                            result.push(validator)
                        }
                    }
                    break;
                case NOT_ONLY_WHITESPACE:
                    if (value) {
                        result.push(notOnlyWhitespace())
                    }
                    break;
                case PATTERN:
                    if (value != null) {
                        result.push(Validators.pattern(value))
                    }
                    break;
                case NOT_INVALID_ID:
                    if (value) {
                        result.push(notInvalidId())
                    }
                    break;
                default:
                    break;
            }
        }
        return result;
    }

}


