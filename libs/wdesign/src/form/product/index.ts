import { FormCheckbox, FormCheckboxItem, FormCheckboxItemMetadata, FormCheckboxMetadata } from './checkbox'
import { Form, FormMetadata } from './form'
import { FormItem, FormItemMetadata } from './form-item'
import { FormInput, FormInputItem, FormInputItemMetadata, FormInputMetadata } from './input'
import { FormLayout, FormLayoutMetadata } from './layout'
import { FormSelect, FormSelectItem, FormSelectItemMetadata, FormSelectMetadata } from './select'

export const ProductComponent = {
    FormInput,
    FormInputItem,
    FormCheckbox,
    FormCheckboxItem,
    FormSelect,
    FormSelectItem,
    Form,
    FormItem,
    FormLayout,
}

export const ProductMetadata = [
    FormInputMetadata,
    FormInputItemMetadata,
    FormMetadata,
    FormItemMetadata,
    FormLayoutMetadata,
    FormCheckboxMetadata,
    FormCheckboxItemMetadata,
    FormSelectMetadata,
    FormSelectItemMetadata,
]
