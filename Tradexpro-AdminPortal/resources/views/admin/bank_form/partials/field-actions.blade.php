<ul class="d-flex activity-menu">
    <li class="viewuser">
        <a href="#" title="{{__("Edit")}}" data-id="{{ $field->id }}" class="btn btn-primary btn-sm btn-edit-field">
            <i class="fa fa-pencil"></i>
        </a>
    </li>
    <li class="viewuser">
        <a href="#" title="{{__("Delete")}}" class="btn btn-danger btn-sm btn-field-delete" data-id="{{ $field->id }}">
            <i class="fa fa-trash"></i>
        </a>
    </li>
</ul>