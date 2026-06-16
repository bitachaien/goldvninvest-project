@extends('admin.master', ['menu' => 'bank_form', 'sub_menu' => 'bank_form'])
@section('title', $title)

@section('content')
<div class="custom-breadcrumb">
    <div class="row">
        <div class="col-6">
            <ul>
                <li>{{ __('Bank Form Fields') }}</li>
                <li class="active-item">{{ $title }}</li>
            </ul>
        </div>
    </div>
</div>

<div class="user-management">
    <div class="card">
        <div class="card-body">
            <button class="btn btn-success mb-3" id="btnAddField">Add New</button>
            <table id="fieldsTable" class="table table-bordered">
                <thead>
                    <tr>
                        <th>{{ __("Title") }}</th>
                        <th>{{ __("Slug") }}</th>
                        <th>{{ __("Data Type") }}</th>
                        <th>{{ __("Required") }}</th>
                        <th>{{ __("Status") }}</th>
                        <th>{{ __("Actions") }}</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>
<!-- Modal -->
<div class="modal fade" id="fieldModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="fieldForm">
                <div class="modal-header">
                    <h5 class="modal-title">Add/Edit Field</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    @csrf
                    <input type="hidden" name="id" id="field_id">
                    <input type="hidden" name="form_id" value="{{ $form->id }}">
                    <div class="mb-3">
                        <label>Title</label>
                        <input type="text" name="title" id="field_title" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>{{ __("Data Type") }}</label>
                        {!! \App\Services\BankService\Enums\BankFormFieldType::renderSelect("data_type", null, ["id"=>"field_data_type", "class"=>"form-control"]) !!}
                    </div>
                    <div class="mb-3">
                        <label>{{ __("Status") }}</label>
                        <select class="form-control" name="status">
                            {!! \App\Enums\FormFieldStatusEnum::renderOptions() !!}
                        </select>
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" name="required" id="field_required" value="1">
                        <label class="form-check-label" for="field_required">Required</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection

@section('script')
<script>
$(function(){
    var table = $('#fieldsTable').DataTable({
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: '{{ route("bank.form.field.list", $form->id) }}',
        columns: [
            { data: 'title' },
            { data: 'slug' },
            { data: 'data_type' },
            { data: 'required' },
            { data: 'status', orderable:false, searchable:false },
            { data: 'action', orderable:false, searchable:false }
        ]
    });

    $('#btnAddField').click(function(){
        $('#fieldForm')[0].reset();
        $('#field_id').val('');
        $('#field_title').removeAttr("disabled");
        $('#fieldModal').modal('show');
    });

    $(document).on('click', '.btn-edit-field', function(){
        var id = $(this).data('id');
        $.get('{{ route("bank.form.field.add.edit.page") }}/' + id, function(response){
            if(response.success){
                $('#field_id').val(response.data.id);
                $('#field_title').val(response.data.title);
                $('#field_title').attr("disabled", "true");
                $('#field_data_type').val(response.data.data_type);
                $('#field_required').prop('checked', !!response.data.required);
            }
            $('#fieldModal').modal('show');
        });
    });

    $(document).on('click', '.btn-field-delete', function(){
        var id = $(this).data('id');
        if(!confirm("{{ __('Are you sure want to delete record!') }}")) return;

        $.get('{{ route("bank.form.field.delete") }}' + id, function(response){
            if(response.success){
                VanillaToasts.create({
                    text: response.message,
                    backgroundColor: "linear-gradient(135deg, #73a5ff, #5477f5)",
                    type: 'success',
                    timeout: 5000
                });
                table.ajax.reload();
            }else{
                VanillaToasts.create({
                    text: response.message,
                    type: 'warning',
                    timeout: 5000
                });
            }
        });
    });

    $('#fieldForm').submit(function(e){
        e.preventDefault();
        $.post('{{ route("bank.form.field.save") }}', $(this).serialize(), function(res){
            if(res.success){
                VanillaToasts.create({
                    text: res.message,
                    backgroundColor: "linear-gradient(135deg, #73a5ff, #5477f5)",
                    type: 'success',
                    timeout: 5000
                });
                $('#fieldModal').modal('hide');
                table.ajax.reload();
            }else{
                $('#fieldModal').modal('hide');
                VanillaToasts.create({
                    text: res.message,
                    type: 'warning',
                    timeout: 5000
                });
            }
        });
    });

    $(document).on('click', '.btn-delete-field', function(){
        if(confirm('Delete this field?')){
            $.ajax({
                url: '/bank-form-field-delete/' + $(this).data('id'),
                type: 'DELETE',
                data: {_token:'{{ csrf_token() }}'},
                success: function(){ table.ajax.reload(); }
            });
        }
    });

    $(document).on('change', '.field-status-toggle', function() {
        var id = $(this).data('id');
        var status = $(this).is(':checked') ? 1 : 0;

        $.post('{{ route("bank.form.field.status") }}',{
                _token: '{{ csrf_token() }}',
                id: id,
                status: status
            },
            function(res) {
                if(res.success){
                    VanillaToasts.create({
                        text: res.message,
                        backgroundColor: "linear-gradient(135deg, #73a5ff, #5477f5)",
                        type: 'success',
                        timeout: 5000
                    });
                } else {
                    VanillaToasts.create({
                        text: res.message,
                        type: 'warning',
                        timeout: 5000
                    });
                }
            }
        );
    });
});
</script>
@endsection