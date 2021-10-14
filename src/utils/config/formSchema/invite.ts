import * as Yup from 'yup';

export const inviteUserSchema = Yup.object().shape({
    email: Yup.string()
        .email('please enter an email')
        .required('please enter an email'),
});
