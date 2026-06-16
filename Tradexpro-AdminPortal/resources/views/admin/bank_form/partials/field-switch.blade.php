<div>
    <label class="switch">
        <input type="checkbox" 
            class="field-status-toggle" data-id="{{ $field->id }}"
            @if ($field->status == STATUS_ACTIVE) checked @endif>
        <span class="slider" for="status"></span>
    </label>
</div>