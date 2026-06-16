@extends('admin.master', ['menu' => 'deposit', 'sub_menu' => 'token_gas'])
@section('title', isset($title) ? $title : '')
@section('style')
@endsection
@section('content')
    <!-- breadcrumb -->
    <div class="custom-breadcrumb">
        <div class="row">
            <div class="col-9">
                <ul>
                    <li>{{ __('Token Deposit') }}</li>
                    <li class="active-item">{{ $title }}</li>
                </ul>
            </div>
        </div>
    </div>
    <!-- /breadcrumb -->

    <!-- User Management -->
    <div class="user-management">
        <div class="row">
            <div class="col-12">
                <div class="card-body">
                    <div class="table-area">
                        <div class="table-responsive">
                            <table id="table" class="table w-100">
                                <thead>
                                    <tr>
                                        <th>{{ __('ID') }}</th>
                                        <th>{{ __('Date') }}</th>
                                        <th>{{ __('Native') }}</th>
                                        <th>{{ __('Token') }}</th>
                                        <th>{{ __('Deposit Tx') }}</th>
                                        <th>{{ __('Amount') }}</th>
                                        <th>{{ __('From Address') }}</th>
                                        <th>{{ __('To Address') }}</th>
                                        <th>{{ __('Tx Hash') }}</th>
                                        <th>{{ __('Status') }}</th>
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
    <!-- /User Management -->

@endsection

@section('script')
    <script>
        (function($) {
            "use strict";

            $('#table').DataTable({
                serverSide: true,
                responsive: false,
                stateSave: true,
                ajax: "{{ route('adminGasSendHistory') }}",
                order: [0, 'desc'],
                language: {
                    paginate: {
                        next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                        previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>'
                    }
                },
                columns: [{
                        "data": "id",
                        name: "id",
                        visible: false,
                    }, {
                        "data": "created_at",
                        "orderable": true,
                        render: function(data, type, row, meta) {
                            return `<p style="white-space: nowrap">${data}</span>`
                        }
                    },
                    {
                        "data": "coin_type",
                        "orderable": true
                    },
                    {
                        "data": "deposit.coin_type",
                        "name": "deposit.coin_type",
                    },
                    {
                        "data": "deposit.transaction_id",
                        "name": "deposit.transaction_id",
                    },
                    {
                        "data": "amount",
                        "orderable": true
                    },
                    {
                        "data": "admin_address",
                        "orderable": true
                    },
                    {
                        "data": "user_address",
                        "orderable": true
                    },
                    {
                        "data": "transaction_hash",
                        "orderable": false
                    },
                    {
                        "data": "status",
                        "orderable": false
                    },
                ],
            });
        })(jQuery);
    </script>
@endsection
