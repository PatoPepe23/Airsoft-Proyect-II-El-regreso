import {Head, Link, router, useForm} from '@inertiajs/react';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { InputText } from 'primereact/inputtext';

import React, { useRef } from "react";
import {Dropdown} from "primereact/dropdown";
import { Toast } from 'primereact/toast';

export default function UsersCreation({ roles_list }) {

    const toast = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: null,
    });

    const roleOptions = roles_list.map(role => ({
        label: role.name,
        value: role.id
    }));

    const editFormClear = () => {
        reset();
    }

    const createUser = (e) => {
        e.preventDefault();

        post(route('admin.users.store'), {
            onSuccess: (page) => {
                editFormClear();
                if (page.props.flash.success) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: page.props.flash.success,
                        life: 3000
                    });
                }
            },
            onError: (errors) => {
                console.error('Error de validación o servidor:', errors);
            }
        });
    }

    return (
        <div>
            <Toast ref={toast} />
            <div>
                <h2 class='text-[22px] text-gray-700 font-bold'>Create Users</h2>
            </div>
            <form onSubmit={createUser}>
                <div className="grid grid-cols-2">
                    <div className="field mb-3 flex flex-col">
                        <label htmlFor="name" className="font-bold">Name</label>
                        <InputText
                            id='name'
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className={errors.name ? 'p-invalid' : ''}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                    <div className="field mb-3 flex flex-col">
                        <label htmlFor="mail" className="font-bold">Mail</label>
                        <InputText
                            id='mail'
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            className={errors.name ? 'p-invalid' : ''}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                </div>
                <div className="grid grid-cols-2">
                    <div className="field mb-3 flex flex-col">
                        <label htmlFor="password" className="font-bold">Password</label>
                        <InputText
                            id='password'
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className={errors.name ? 'p-invalid' : ''}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                    <div className="field mb-3 flex flex-col">
                        <label htmlFor="role_id" className="font-bold">Rol</label>
                        <Dropdown
                            id="role_id"
                            defaultValue={data.role_id}
                            value={data.role_id}
                            options={roleOptions}
                            onChange={(e) => setData('role_id', e.value)}
                            optionValue="value"
                            optionLabel="label"
                            placeholder="Select a rol"
                            className={errors.role_id ? 'p-invalid' : ''}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                </div>
                <div>
                    <button type={"submit"}>Create</button>
                </div>
            </form>
        </div>
    )
}
