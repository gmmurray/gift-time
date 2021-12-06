import * as Yup from 'yup';

export const signupSchema = Yup.object().shape({
    email: Yup.string()
        .email('please enter a valid email')
        .required('please enter a valid email'),
    password: Yup.string().required('please enter a password'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'passwords must match',
    ),
});

export const signInSchema = Yup.object().shape({
    email: Yup.string()
        .email('please enter a valid email')
        .required('please enter a valid email'),
    password: Yup.string().required('please enter a password'),
});

export const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('please enter a valid email')
        .required('please enter a valid email'),
});

export const resetPasswordSchema = Yup.object().shape({
    password: Yup.string().required('please enter a password'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'passwords must match',
    ),
});
