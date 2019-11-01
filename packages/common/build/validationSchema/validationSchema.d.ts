import * as yup from "yup";

declare const passwordValidation: yup.StringSchema<string>;
declare const registerValidation: yup.ObjectSchema<
  yup.Shape<
    object,
    {
      email: string;
      username: string;
      password: string;
      passwordConfirm: string;
    }
  >
>;
declare const loginValidation: yup.ObjectSchema<
  yup.Shape<
    object,
    {
      username: string;
      password: string;
    }
  >
>;
export { loginValidation, passwordValidation, registerValidation };
