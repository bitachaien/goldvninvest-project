<?php

namespace Database\Factories;

use App\Model\Coin;
use App\Model\CoinPair;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoinPairFactory extends Factory
{

    /**
     * The name of the factory's corresponding model.
     *
     * @var string|null
     */
    protected $model = CoinPair::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        static $id = 4;
        $parent_coin_id = 2;
        $child_coin_id = Coin::select('id')->where('id', ">", $id++)->first()?->id;
        if($this->existPair($parent_coin_id, $child_coin_id ?? 2)) {
            $pair = $this->getUniquePair();
            $parent_coin_id = $pair["parent_coin_id"];
            $child_coin_id  = $pair["child_coin_id"];
        }
        return [
            "parent_coin_id" => $parent_coin_id,
            "child_coin_id" => ($child_coin_id),
            "initial_price" => $this->faker->numberBetween(0,0),
            "price" => $this->faker->numberBetween(0,0),
        ];
    }

    private function getUniquePair(): array
    {
        $parent_coin_id = Coin::select('id')->orderBy(DB::raw('RAND()'))->first()?->id;
        $child_coin_id  = Coin::select('id')->orderBy(DB::raw('RAND()'))->first()?->id;

        if($this->existPair($parent_coin_id, $child_coin_id))
            return $this->getUniquePair();

        return [
            "parent_coin_id" => $parent_coin_id,
            "child_coin_id"  => $child_coin_id,
        ];
    }

    private function existPair(int $parent_coin_id, int $child_coin_id){
        return !!CoinPair::select('id')->where([
            "parent_coin_id" => $parent_coin_id,
            "child_coin_id"  => $child_coin_id,
        ])->first();
    }
}
