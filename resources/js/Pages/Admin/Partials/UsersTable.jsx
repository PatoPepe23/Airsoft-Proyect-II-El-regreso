import React, { useState, useRef } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, router, useForm} from '@inertiajs/react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';


export default function UsersTable({ users_list, roles_list }) {

    const usersList = users_list?.data || [];

    const toast = useRef(null);
    const dt = useRef(null);
    const [deleteUserDialog, setDeleteUserDialog] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const [editUserDialog, setEditUserDialog] = useState(null);
    const [userToEdit, setUserToEdit] = useState(null);

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button icon="pi pi-pencil" severity="success" rounded onClick={() => confirmEditUser(rowData)} />
                <Button icon="pi pi-trash" severity="danger" rounded onClick={() => confirmDeleteUser(rowData)} />
            </div>
        );
    };

    const { data, setData, post, processing, errors, reset, clearErrors, patch } = useForm({
        id: '',
        name: '',
        email: '',
        role_id: null,
    });

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="m-0">Users Management</h4>
        </div>
    );

    //Delete Functions
    const confirmDeleteUser = (user) => {
        setUserToDelete(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        router.delete(route('admin.users.destroy', { user: userToDelete.id }), {
            onSuccess: () => {
                setDeleteUserDialog(false);
                setUserToDelete(null)
                success();
            },
            onError: () => {
                console.error('Error while deleting user')
                setDeleteUserDialog(false);
                reject();
            },
            preserveScroll: true
        })
    }

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
        setUserToDelete(null);
    }

    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteUser} />
        </React.Fragment>
    );

    // Edit Functions

    const roleOptions = roles_list.map(role => ({
        label: role.name,
        value: role.id
    }));

    const confirmEditUser = (user) => {
        setData({
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.current_role_id || null,
        });
        setUserToEdit(user);
        setEditUserDialog(true);
    };

    const hideEditUserDialog = () => {
        setEditUserDialog(false);
        setUserToEdit(null);
        reset();
        clearErrors();
    };

    const updateUser = (e) => {
        e.preventDefault();

        patch(route('admin.users.update', data.id), {
            onSuccess: (page) => {
                hideEditUserDialog();
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
            },
        });
    };

    const editUserDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideEditUserDialog} />
            <Button label="Guardar" icon="pi pi-check" severity="success" onClick={updateUser} disabled={processing} />
        </>
    );

    const success = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Operation Success', life: 3000 });
    }

    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ups, something went wrong', life: 3000 });
    }

    return (
        <div>
            <Toast ref={toast} />
            <DataTable
                ref={dt}
                value={usersList}
                dataKey="id"

                paginator
                rows={10}
                rowsPerPageOptions={[10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                header={header}
                emptyMessage="No se encontraron usuarios."
            >

                <Column field="id" header="ID" sortable style={{ minWidth: '5rem' }} />
                <Column field="name" header="Name" sortable filter filterPlaceholder="Buscar por nombre" style={{ minWidth: '14rem' }} />
                <Column field="email" header="Email" sortable filter filterPlaceholder="Buscar por email" style={{ minWidth: '16rem' }} />

                <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />

            </DataTable>

            <Dialog
                visible={deleteUserDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirmación"
                modal
                footer={deleteUserDialogFooter}
                onHide={hideDeleteUserDialog}
            >
                <div className="confirmation-content flex items-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: 'red' }} />
                    {userToDelete && (
                        <span>
                            ¿Está seguro de que desea eliminar a **{userToDelete.name}**?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={editUserDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirmación"
                modal
                footer={editUserDialogFooter}
                onHide={hideEditUserDialog}
            >
                <form onSubmit={updateUser}>
                    <div className="p-fluid">

                        <div className="field mb-3">
                            <label htmlFor="name" className="font-bold">Nombre</label>
                            <InputText
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className={errors.name ? 'p-invalid' : ''}
                            />
                            {errors.name && <small className="p-error">{errors.name}</small>}
                        </div>

                        <div className="field mb-3">
                            <label htmlFor="email" className="font-bold">Email</label>
                            <InputText
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className={errors.email ? 'p-invalid' : ''}
                            />
                            {errors.email && <small className="p-error">{errors.email}</small>}
                        </div>

                        <div className="field mb-3">
                            <label htmlFor="role_id" className="font-bold">Rol</label>
                            <Dropdown
                                id="role_id"
                                defaultValue={data.name}
                                value={data.role_id}
                                options={roleOptions}
                                onChange={(e) => setData('role_id', e.value)}
                                optionValue="value"
                                optionLabel="label"
                                placeholder="Selecciona un rol"
                                className={errors.role_id ? 'p-invalid' : ''}
                            />
                            {errors.role_id && <small className="p-error">{errors.role_id}</small>}
                        </div>

                    </div>
                </form>
            </Dialog>

        </div>

    );
}
