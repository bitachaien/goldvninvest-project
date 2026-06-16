@extends('admin.master', ['menu' => 'bank_form', 'sub_menu' => 'bank_form'])
@section('title', $title)

@section('content')
<div class="custom-breadcrumb">
    <div class="row">
        <div class="col-6">
            <ul>
                <li>{{ __('Bank Forms') }}</li>
                <li class="active-item">{{ $title }}</li>
            </ul>
        </div>
    </div>
</div>

<div class="user-management">
    <div class="card">
        <div class="card-body">
            <button class="btn btn-success mb-3" id="btnAdd">Add New</button>
            <table id="bankFormTable" class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>{{ __('Title') }}</th>
                        <th>{{ __('Access To') }}</th>
                        <th>{{ __('Status') }}</th>
                        <th>{{ __('Created At') }}</th>
                        <th>{{ __('Actions') }}</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="bankFormModal" tabindex="-1" aria-labelledby="bankFormModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form id="bankForm">
        {{  csrf_field()  }}
        <div class="modal-header">
          <h5 class="modal-title" id="bankFormModalLabel">Add/Edit Bank Form</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <input type="hidden" name="id" id="form_id">

            <div class="mb-3">
                <label class="form-label">{{ __("Title") }}</label>
                <input type="text" name="title" id="form_title" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">{{ __("Access To") }}</label>
                {!! \App\Services\BankService\Enums\BankFormAccessType::renderSelect("access", null, ["class"=>"form-control selectpicker", "data-style" => "dark"]) !!}
            </div>

            <div class="mb-3">
                <label class="form-label">Status</label>
                <select name="status" id="form_status" class="form-control" required>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>
            </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>

@endsection

@section('script')
<script>
$(document).ready(function () {
    var table = $('#bankFormTable').DataTable({
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: '{{ route("bank.form.list.page") }}',
        columns: [
            { data: 'title', name: 'title' },
            { data: 'access', name: 'access' },
            { data: 'status', name: 'status' },
            { data: 'created_at', name: 'created_at' },
            { data: 'action', name: 'action', orderable: false, searchable: false },
        ]
    });

    // Add new
    $('#btnAdd').click(function(){
        $('#bankForm')[0].reset();
        $('#access').selectpicker('val', $('#access option:first').val());
        $('#form_id').val('');
        $('#bankFormModal').modal('show');
    });

    // Edit
    $(document).on('click', '.btn-edit', function(){
        var id = $(this).data('id');
        $.get('{{ route("bank.form.add.edit.page") }}/' + id, function(response){
            if (response.success) {
                $('#form_id').val(response.data.id);
                $('#form_title').val(response.data.title);
                $('#form_status').val(response.data.status);
                let access = response.data.access.split(",");
                $('#access').selectpicker('val', access);
            }
            $('#bankFormModal').modal('show');
        });
    });

    // Save
    $('#bankForm').submit(function(e){
        e.preventDefault();
        $.post('{{ route("bank.form.submit") }}', $(this).serialize(), function(res){
            if (res.success) {
                $('#bankFormModal').modal('hide');
                table.ajax.reload();
            }
        });
    });
});
</script>
@endsection

