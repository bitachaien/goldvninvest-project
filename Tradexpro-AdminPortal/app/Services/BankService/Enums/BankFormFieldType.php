<?php

namespace App\Services\BankService\Enums;

enum BankFormFieldType: string
{
    case TEXT = 'text';
    case TEXTAREA = 'textarea';
    case NUMBER = 'number';
    case EMAIL = 'email';
    case SELECT = 'select';
    case RADIO = 'radio';
    case CHECKBOX = 'checkbox';
    case DATE = 'date';
    case FILE = 'file';

    /**
     * Summary of options
     * @return string[]
     */
    public static function options(): array
    {
        return [
            self::TEXT->value => 'Text',
            // self::TEXTAREA->value => 'Textarea',
            self::NUMBER->value => 'Number',
            self::EMAIL->value => 'Email',
            // self::SELECT->value => 'Select',
            // self::RADIO->value => 'Radio',
            // self::CHECKBOX->value => 'Checkbox',
            // self::DATE->value => 'Date',
            // self::FILE->value => 'File',
        ];
    }

    /**
     * Summary of renderSelect
     * @param string $name
     * @param ?string $selected
     * @param array<mixed> $attributes
     * @return string
     */
    public static function renderSelect(string $name = 'data_type', ?string $selected = null, array $attributes = []): string
    {
        $attrs = '';
        foreach ($attributes as $key => $value) {
            $attrs .= sprintf(' %s="%s"', htmlspecialchars($key), htmlspecialchars($value));
        }

        $html = sprintf('<select name="%s" id="%s"%s>', htmlspecialchars($name), htmlspecialchars($name), $attrs);

        foreach (self::options() as $value => $label) {
            $isSelected = $selected === $value ? ' selected' : '';
            $html .= sprintf('<option value="%s"%s>%s</option>', htmlspecialchars($value), $isSelected, htmlspecialchars($label));
        }

        $html .= '</select>';

        return $html;
    }
}