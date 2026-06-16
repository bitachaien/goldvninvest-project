<?php

namespace App\Services\BankService\Enums;

enum BankFormAccessType: int
{
    case USER = 1;
    case ADMIN = 2;
    // case ICO  = 3;
    // case P2P  = 4;

    public function label(): string
    {
        return match ($this) {
            self::USER => 'User',
            self::ADMIN => 'Admin',
            // self::ICO  => 'ICO',
            // self::P2P  => 'P2P',
        };
    }

    /**
     * Summary of options
     * @return string[]
     */
    public static function options(): array
    {
        return [
            self::USER->value => 'User',
            self::ADMIN->value => 'Admin',
            // self::ICO->value  => 'ICO',
            // self::P2P->value  => 'P2P',
        ];
    }

    /**
     * Summary of renderSelect
     * @param string $name
     * @param ?int $selected
     * @param array<mixed> $attributes
     * @return string
     */
    public static function renderSelect(string $name = 'data_type', ?int $selected = null, array $attributes = []): string
    {
        $attrs = '';
        foreach ($attributes as $key => $value) {
            $attrs .= sprintf(' %s="%s"', htmlspecialchars($key), htmlspecialchars($value));
        }

        $html = sprintf('<select multiple name="%s[]" id="%s"%s>', htmlspecialchars($name), htmlspecialchars($name), $attrs);

        foreach (self::options() as $value => $label) {
            $isSelected = $selected === $value ? ' selected' : '';
            $html .= sprintf('<option value="%s"%s>%s</option>', htmlspecialchars($value), $isSelected, htmlspecialchars($label));
        }

        $html .= '</select>';

        return $html;
    }
}