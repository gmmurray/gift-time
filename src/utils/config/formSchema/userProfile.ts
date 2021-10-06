import * as Yup from 'yup';

export const userProfileSchema = Yup.object().shape({
    display_name: Yup.string().required('please enter a display name'),
    avatar_url: Yup.string().url('please enter a valid url'),
});
