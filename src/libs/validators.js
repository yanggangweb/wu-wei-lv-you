import { withParams,req, regex } from "vuelidate/lib/validators/common.js"


export var phone = regex('phoneNumber', /^1(3|4|5|7|8)\d{9}$/);


export var verificationCode = regex('verificationCode', /^\d{6,6}$/);
