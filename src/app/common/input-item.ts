import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";
import { ValidatorList } from "../validators/custom-validators";

export type AccessorFunction = () => AbstractControl | null;

/**
 * Class representing on text/number/email input item
 */
export class InputItem {
    static readonly MAX_TEXT_LEN: number = (512*1024);  // default used by some browsers

    public static readonly REPLACE_BY_LABEL = "{{label}}";

    static readonly TEXT = "text";
    static readonly EMAIL = "email";
    static readonly NUMBER = "number"

    static readonly MIN_MAX_TYPES = [InputItem.NUMBER]
    static readonly MIN_MAX_LEN_TYPES = [InputItem.TEXT, InputItem.EMAIL]

    public label: string;
    public ctrlName: string;
    public type: string;
    public placeholder: string;
    public min: number | null;
    public max: number | null;
    public required: boolean;
    public notWhitespaceOnly: boolean;
    public pattern: string | null;
    public pattern_error_msg: string | null;
    public accessor: AccessorFunction;
    public notInvalidId: boolean;
    /**
     * Constructor
     * @param label       label for inout
     * @param ctrlName    form control name
     * @param type        input type; text, email etc.
     * @param placeholder placeholder text
     * @param min         text/email: minlength
     *                    number: minimum value
     * @param max         text/email: maxlength
     *                    number: maximum value
     * @param required    required flag
     * @param notWhitespaceOnly not whitespace only flag
     * @param pattern     regex pattern
     */
    constructor() {
                  this.label = '';
                  this.ctrlName = '';
                  this.type = '';
                  this.placeholder = '';
                  this.min = null;
                  this.max = null;
                  this.required = false;
                  this.notWhitespaceOnly= false;
                  this.pattern = null;
                  this.pattern_error_msg = null;
                  this.accessor = () => new FormControl();
                  this.notInvalidId = false;
    }
  
    
    public setRequired(value : boolean): InputItem {
      this.required = value;
      return this;
    }
  
    public setMinLength(value: number): InputItem {
      if (this.isMinMaxLenType('minlength')) {
        this.min = value;
      }
      return this;
    }
  
    public setMaxLength(value: number): InputItem {
      if (this.isMinMaxLenType('maxlength')) {
        this.max = value;
      }
      return this;
    }
  
    public setMin(value: number): InputItem {
      if (this.isMinMaxType('min')) {
        this.min = value;
      }
      return this;
    }
  
    public setMax(value: number): InputItem {
      if (this.isMinMaxType('max')) {
        this.max = value;
      }
      return this;
    }
  
    public setNotWhitespaceOnly(value : boolean): InputItem {
      this.notWhitespaceOnly = value;
      return this;
    }

    public setPattern(value : string): InputItem {
      this.pattern = value;
      return this;
    }

    public setPatternErrorMsg(value : string): InputItem {
      this.pattern_error_msg = value.replace(InputItem.REPLACE_BY_LABEL, this.label);
      return this;
    }

    public setNotInvalidId(value : boolean): InputItem {
      this.notInvalidId = value;
      return this;
    }

    public setAccessor(value: AccessorFunction) {
      this.accessor = value;
      return this;
    }

    public validatorList(): ValidatorList {
      let list = ValidatorList.of()
                  .setRequired(this.required)
                  .setNotOnlyWhitespace(this.notWhitespaceOnly)
                  .setNotInvalidId(this.notInvalidId)
                  .setPattern(this.pattern);
      if (this.min != null || this.max != null) {
        let minMaxLen = this.isMinMaxLenType();
        if (this.min != null) {
          if (minMaxLen) {
            list.setMinLength(this.min);
          } else {
            list.setMin(this.min);
          }
        }
        if (this.max != null) {
          if (minMaxLen) {
            list.setMaxLength(this.max);
          } else {
            list.setMax(this.max);
          }
        }
      }
      return list;
    }
  
    private isMinMaxLenType(property?: string): boolean {
      let result = true;
      if (!InputItem.MIN_MAX_LEN_TYPES.find(element => element === this.type)) {
        if (property != null) {
          throw new Error(`'${property}' is not supported for type '${this.type}'`);
        }
        result = false;
      }
      return result;
    }

    private isMinMaxType(property?: string): boolean {
      let result = true;
      if (!InputItem.MIN_MAX_TYPES.find(element => element === this.type)) {
        if (property != null) {
          throw new Error(`'${property}' is not supported for type '${this.type}'`);
        }
        result = false;
      }
      return result;
    }

    private setBasic(label: string, ctrlName: string, type: string, placeholder: string, 
                          min: number, max: number): InputItem {
      this.label = label;
      this.ctrlName = ctrlName;
      this.type = type;
      this.placeholder = placeholder;
      this.min = min;
      this.max = max;
      return this;
    }

    public copy(): InputItem {
      let copy = new InputItem();
      Object.assign(copy, this)
      return copy;
    }

    public static text_len(label: string, ctrlName: string, placeholder: string, 
                            minlength: number, maxlength: number): InputItem {
      return new InputItem()
                  .setBasic(label, ctrlName, InputItem.TEXT, placeholder, minlength, maxlength);
    }

    public static text(label: string, ctrlName: string, placeholder: string): InputItem {
      return InputItem.text_len(label, ctrlName, placeholder, 0, InputItem.MAX_TEXT_LEN);
    }
  
    public static email_len(label: string, ctrlName: string, placeholder: string, 
                            minlength: number, maxlength: number): InputItem {
      return new InputItem()
                  .setBasic(label, ctrlName, InputItem.EMAIL, placeholder, minlength, maxlength);
    }
  
    public static email(label: string, ctrlName: string, placeholder: string): InputItem {
      return InputItem.email_len(label, ctrlName, placeholder, 0, InputItem.MAX_TEXT_LEN);
    }
  
    public static number_min_max(label: string, ctrlName: string, placeholder: string, 
                                min: number, max: number): InputItem {
      return new InputItem()
                  .setBasic(label, ctrlName, InputItem.NUMBER, placeholder, min, max);
    }
  
    public static number(label: string, ctrlName: string, placeholder: string): InputItem {
      return InputItem.number_min_max(label, ctrlName, placeholder, 
                                      Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    }
  }