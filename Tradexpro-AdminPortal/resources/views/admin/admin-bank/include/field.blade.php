@isset($fields)
    @foreach ($fields as $field)
        <div class="col-md-6 mt-20">
            <div class="form-group">
                <label for="{{ $field->slug }}">{{__($field->title)}}</label>
                <input type="{{ $field->data_type->value }}" name="{{ $field->slug }}" class="form-control" value="{{ $field->value }}">
                <span class="text-danger"><strong>{{ $errors->first($field->slug) }}</strong></span>
            </div>
        </div>
    @endforeach
@endisset