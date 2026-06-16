<?php

namespace App\Enums;

enum FormFieldStatusEnum: int
{
    case Active = 1;
    case Inactive = 0;

    public function label(): string
    {
        return match ($this) {
            self::Active   => 'Active',
            self::Inactive => 'Inactive',
        };
    }

    /**
     * Return options as [value => label] array
     */
    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }
        return $options;
    }

    /**
     * Render HTML <option> list
     */
    public static function renderOptions(int|string|null $selected = null): string
    {
        $html = '';
        foreach (self::options() as $value => $label) {
            $isSelected = ($selected !== null && (string)$selected === (string)$value) ? ' selected' : '';
            $html .= "<option value=\"{$value}\"{$isSelected}>{$label}</option>\n";
        }
        return $html;
    }
}