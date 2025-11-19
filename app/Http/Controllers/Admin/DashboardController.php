<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {
        $users = User::with('roles')
            ->orderBy('name')
            ->paginate(5)
            ->withQueryString()
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->implode(', '),
            ]);

        $roles = Role::all(['id', 'name']);

        return Inertia::render('Admin/Dashboard', [
            'users_list' => $users,
            'roles_list' => $roles
        ]);
    }
}
