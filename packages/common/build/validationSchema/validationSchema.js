"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
const passwordRegex = {
    upperCase: new RegExp("[A-Z]"),
    lowerCase: new RegExp("[a-z]"),
    number: new RegExp("[0-9]"),
    special: new RegExp("[#?!@$%^&*-]")
};
const passwordValidation = yup
    .string()
    .required()
    .min(6)
    .matches(passwordRegex.upperCase, "password must contain at least one upper case letter")
    .matches(passwordRegex.lowerCase, "password must contain at least one lower case letter")
    .matches(passwordRegex.number, "password must contain at least one number")
    .matches(passwordRegex.special, "password must contain at least one special character");
exports.passwordValidation = passwordValidation;
const registerValidation = yup.object().shape({
    email: yup
        .string()
        .required()
        .email(),
    username: yup
        .string()
        .required()
        .min(3),
    password: passwordValidation,
    passwordConfirm: yup
        .string()
        .required("confirm is a required field")
        .oneOf([yup.ref("password")], "passwords should match")
});
exports.registerValidation = registerValidation;
const loginValidation = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required()
});
exports.loginValidation = loginValidation;
//# sourceMappingURL=validationSchema.js.map