<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
        ]);

        $admin->assignRole(1);

        $this->command->info('Administrador creado: admin@example.com / password');

        $regularUsersCount = 4;

        User::factory($regularUsersCount)->create()->each(function ($user) {
            $user->assignRole(2);
        });

        $this->command->info("{$regularUsersCount} usuarios regulares de prueba creados.");
    }
}
