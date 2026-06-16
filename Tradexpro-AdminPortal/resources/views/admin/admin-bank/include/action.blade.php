<ul class="d-flex activity-menu">
    <li class="viewuser">
        <a title="{{__('View')}}" href="#" data-bank="{{ $bank->bank }}" class="view_bank_details btn btn-info btn-sm">
            <i class="fa fa-eye"></i>
        </a>
    </li>
    <li class="viewuser">
        <a title="{{__('Edit')}}" href="{{ route("bank.form.record.edit",["id" => $bank->id]) }}" class="btn btn-primary btn-sm">
            <i class="fa fa-pencil"></i>
        </a>
    </li>
    <li class="viewuser">
        <a title="{{__('Delete')}}" href="#"  data-id="{{ $bank->id }}" class="btn btn-danger btn-sm bank_delete">
            <i class="fa fa-trash"></i>
        </a>
    </li>
</ul>