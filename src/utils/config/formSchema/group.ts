import * as Yup from 'yup';

export const addGroupSechma = Yup.object().shape({
    name: Yup.string().required('please enter a name'),
    due_date: Yup.date(),
});
