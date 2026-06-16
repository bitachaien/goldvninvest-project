@extends('admin.master',['menu'=>'bank_form', 'sub_menu'=>'admin_bank'])
@section('title', isset($title) ? $title : '')
@section('style')
@endsection
@section('content')
    <!-- breadcrumb -->
    <div class="custom-breadcrumb">
        <div class="row">
            <div class="col-5">
                <ul>
                    <li>{{__('Admin Bank')}}</li>
                    <li class="active-item">{{ $title }}</li>
                </ul>
            </div>
            <div class="col-sm-7 text-right">
                <a class="add-btn theme-btn" href="{{route('bank.form.record.add')}}">{{__('Add New')}}</a>
            </div>
        </div>
    </div>
    <!-- /breadcrumb -->

    <!-- User Management -->
    <div class="user-management">
        <div class="row">
            <div class="col-12">
                <div class="header-bar p-4">
                    <div class="table-title">
                        <h3>{{ $title }}</h3>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-area payment-table-area">
                        <div class="table-responsive">
                            <table id="table" class="table table-borderless custom-table display text-center" width="100%">
                                <thead>
                                <tr>
                                    <th scope="col">{{__('Name')}}</th>
                                    <th scope="col">{{__('Status')}}</th>
                                    <th scope="col">{{__('Action')}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<!-- Bank Detail Delete Modal -->
<div id="deleteModal" class="modal fade delete" role="dialog">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header"><h6 class="modal-title">{{__('Delete')}}</h6><button type="button" class="close" data-dismiss="modal">&times;</button></div>
            <div class="modal-body"><p>{{ __('Do you want to delete ?')}}</p></div>
            <div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">{{__("Close")}}</button>
                <a class="btn btn-danger" id="deleteBankConfirm" href="#">{{__('Confirm')}} </a>
            </div>
        </div>
    </div>
</div>

<!-- Bank Details Modal -->
<div class="modal fade" id="bankFormModal" tabindex="-1" aria-labelledby="bankFormModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bankFormModalLabel">{{ __("Bank Details") }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="bankDetailsContainer">

        </div>
    </div>
  </div>
</div>

@endsection
@section('script')
    <script>

        function statusChange(bank_id) {
            $.ajax({
                type: "POST",
                url: "{{ route('bank.form.record.status') }}",
                data: {
                    '_token': "{{ csrf_token() }}",
                    'bank_id': bank_id
                },
                success: function (data) {
                    console.log(data);
                }
            });
        }

        $(document).ready(function () {

            $(document).on('change', '.record-status-toggle', function() {
                var id = $(this).data('id');
                $.post('{{ route("bank.form.record.status") }}',{
                        _token: '{{ csrf_token() }}',
                        bank_id: id
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

            $(document).on('click', '.view_bank_details', function(){
                let data = $(this).data('bank');

                let container = $("#bankDetailsContainer");
                container.empty();

                let html = "<ul class='list-group'>";
                $.each(data, function(key, value) {
                    if (value === null) value = "<i class='text-muted'>null</i>";
                    html += `<li class="list-group-item d-flex justify-content-between">
                                <strong>${value.title}</strong> 
                                <span>${value.value}</span>
                            </li>`;
                });
                html += "</ul>";

                container.html(html);
                $("#bankFormModal").modal("show");
            });
            
            $(document).on('click', '.bank_delete', function(){
                let id = $(this).data('id');
                let url = '{{ route("bank.form.record.delete") }}' + id;
                $("#deleteBankConfirm").attr("href", url);
                $("#deleteModal").modal("show");
            });

        });

        $('#table').DataTable({
            processing: true,
            serverSide: true,
            paging: true,
            stateSave: true,
            searching: true,
            ordering:  true,
            select: false,
            columns: [
                { "data": "bank_title", "orderable": true, 'searchable': true },
                { "data": "status"},
                { "data": "action"},
            ],
            bDestroy: true,
            order: [0, 'asc'],
            responsive: true,
            autoWidth: false,
            language: {
                "decimal":        "",
                "emptyTable":     "{{__('No data available in table')}}",
                "info":           "{{__('Showing')}} _START_ to _END_ of _TOTAL_ {{__('entries')}}",
                "infoEmpty":      "{{__('Showing')}} 0 to 0 of 0 {{__('entries')}}",
                "infoFiltered":   "({{__('filtered from')}} _MAX_ {{__('total entries')}})",
                "infoPostFix":    "",
                "thousands":      ",",
                "lengthMenu":     "{{__('Show')}} _MENU_ {{__('entries')}}",
                "loadingRecords": "{{__('Loading...')}}",
                "processing":     "",
                "search":         "{{__('Search')}}:",
                "zeroRecords":    "{{__('No matching records found')}}",
                "paginate": {
                    "first":      "{{__('First')}}",
                    "last":       "{{__('Last')}}",
                    "next":       '{{__('Next')}} &#8250;',
                    "previous":   '&#8249; {{__('Previous')}}'
                },
                "aria": {
                    "sortAscending":  ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                }
            },
        });
    </script>
@endsection
