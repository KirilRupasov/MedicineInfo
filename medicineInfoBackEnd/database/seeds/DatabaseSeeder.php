<?php
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        // Remove any existing data
        //DB::table('pages')->truncate();

        $faker = Faker\Factory::create();

        // Generate some dummy data
        for($i=0; $i<30; $i++) {
            \App\Medicine::create([
                'title' => $faker->firstName,
                'side_effects' => $faker->sentence(1),
                'description' => $faker->sentence(1),
                'barcode' => $faker->bankAccountNumber
            ]);
        }
    }
}
