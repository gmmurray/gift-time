import * as Yup from 'yup';

export const addGiftSchema = Yup.object().shape({
    name: Yup.string().required('please enter a name'),
    price: Yup.number()
        .required('please enter a price')
        .typeError('please enter a price'),
    description: Yup.string(),
    web_link: Yup.string().url('please enter a valid web link'),
    priority: Yup.number()
        .required('please select a priority')
        .typeError('please enter a priority'),
    is_private: Yup.boolean().required('please select a privacy setting'),
});
