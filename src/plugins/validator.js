import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';

const config = {
    classes: true,
    classNames: {
        touched: 'touched',
        untouched: 'untouched',
        valid: 'valid',
        invalid: 'invalid',
        pristine: 'pristine',
        dirty: 'dirty',
    },
    events: 'input',
};

Validator.extend('not_zero', {
    getMessage: field => 'The ' + field + ' value must be not equal to zero.',
    validate: value => value !== 0 && value !== '0',
});


Vue.use(VeeValidate, config);
