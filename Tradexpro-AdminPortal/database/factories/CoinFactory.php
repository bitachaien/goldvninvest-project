<?php

namespace Database\Factories;

use App\Model\Coin;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoinFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string|null
     */
    protected $model = Coin::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        static $coinType = "ABCD";
        return [
            "name"      => $this->faker->name(),
            "coin_type" => $coinType++,
            // "coin_type" => strtoupper(Str::substr($this->faker->unique()->word(), 0,3)),
        ];
    }
}
