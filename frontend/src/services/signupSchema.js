
// import * as yup from "yup";

// export const signupSchema = yup.object().shape({
//   first_name: yup.string().required("First name is required"),
//   last_name: yup.string().required("Last name is required"),
//   phone: yup
//     .string()
//     .matches(/^07[0-9]{8}$/, "Invalid Jordanian phone number")
//     .required("Phone number is required"),
//   email: yup.string().email("Invalid email").nullable(),
//   password: yup.string().min(6, "Password must be at least 6 characters"),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref("password")], "Passwords do not match"),
//   city: yup.string().required("City is required"),
//   area: yup.string().required("Area is required"),
// });
import * as yup from "yup";

export const signupSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("First name is required")
    .min(2, "Too short"),

  last_name: yup
    .string()
    .required("Last name is required")
    .min(2, "Too short"),

  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^07[0-9]{8}$/, "Invalid Jordanian phone number"),

  email: yup.string().email("Invalid email").nullable(),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "At least 6 characters"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),

  city_id: yup.string().required("City is required"),

  area_id: yup.string().required("Area is required"),
});
