<?php

namespace App\Model;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

trait HasAnyFactory
{
    /**
     * Get a new factory instance for the model.
     *
     * @param  mixed  $parameters
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public static function factory(...$parameters)
    {
        $factory = static::newFactory() ?: Factory::factoryForModel(Str::after(get_called_class(), 'App\Model\\'));

        return $factory
                    ->count(is_numeric($parameters[0] ?? null) ? $parameters[0] : null)
                    ->state(is_array($parameters[0] ?? null) ? $parameters[0] : ($parameters[1] ?? []));
    }

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        //
    }
}
